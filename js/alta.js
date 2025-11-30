// ------------------------------------------------
//             variables globales
// ------------------------------------------------

// ------------------------------------------------
//             funciones globales
// ------------------------------------------------
/*function agregar(e) {
    e.preventDefault()

    console.log('agregar producto')

    var refNombre = document.getElementById('nombre')
    var refPrecio = document.getElementById('precio')
    var refStock = document.getElementById('stock')
    var refMarca = document.getElementById('marca')
    var refCategoria = document.getElementById('categoria')
    var refDetalles = document.getElementById('detalles')
    var refFoto = document.getElementById('foto')
    var refEnvio = document.getElementById('envio')

    var nombre = refNombre.value
    var precio = refPrecio.value
    var stock = refStock.value
    var marca = refMarca.value
    var categoria = refCategoria.value
    var detalles = refDetalles.value
    var foto = refFoto.value
    var envio = refEnvio.checked

    var producto = {
        nombre: nombre,
        precio: +precio,
        stock: parseInt(stock),
        marca: marca,
        categoria: categoria,
        detalles: detalles,
        foto: foto,
        envio: envio
    }

    console.log(producto)
    productos.push(producto)

    representarTablaProductos()

    refNombre.value = ''
    refPrecio.value = ''
    refStock.value = ''
    refMarca.value = ''
    refCategoria.value = ''
    refDetalles.value = ''
    refFoto.value = ''
    refEnvio.checked = false
}


function representarTablaProductos() {
    var filasTabla = ''

    //encabezado de la tabla
    filasTabla +=
            '<tr>'+
                '<th>nombre</th>' +
                '<th>precio</th>' +
                '<th>stock</th>' +
                '<th>marca</th>' +
                '<th>categoría</th>' +
                '<th>detalles</th>' +
                '<th>foto</th>' +
                '<th>envío</th>' +
            '</tr>'

    //datos de la tabla
    for(var i=0; i<productos.length; i++) {
        var producto = productos[i]
        filasTabla +=
                '<tr>' +
                    '<td>' + producto.nombre + '</td>' +
                    '<td class="centrar">' + producto.precio + '</td>' +
                    '<td class="centrar">' + producto.stock + '</td>' +
                    '<td>' + producto.marca + '</td>' +
                    '<td>' + producto.categoria + '</td>' +
                    '<td>' + producto.detalles + '</td>' +
                    '<td><img width="75" src="' + producto.foto + '" alt="foto de ' + producto.nombre + ' ' + producto.marca + '"></td>' +
                    '<td class="centrar">' + (producto.envio? 'Si':'No') + '</td>' +
                '</tr>'
    }

    document.querySelector('table').innerHTML = filasTabla
}

function start() {
    console.warn( document.querySelector('title').innerText )

    representarTablaProductos()
}
*/

//nuevo

function initAlta(){
    const form = document.getElementById('form-alta-producto');
    const tablaBody = document.querySelector('#tabla-productos tbody');
    if (!form) return;
    function renderizarTabla() {
        if (!tablaBody) return;
        tablaBody.innerHTML = ''; // Limpiar la tabla antes de renderizar
        const list = window.productos || [];
        list.forEach(p => {
            const fila = document.createElement('tr');
            const imagenUrl = p.foto || p.imagen;
            const imgSrc = (imagenUrl && imagenUrl !== '' && imagenUrl !== 'undefined') 
                ? imagenUrl 
                : 'https://via.placeholder.com/50?text=No';
            
            fila.innerHTML = `
                <td>${p.nombre || ''}</td>
                <td>${p.precio || ''}</td>
                <td>${p.stock || ''}</td>
                <td>${p.marca || ''}</td>
                <td>${p.categoria || ''}</td>
                <td>${p['descripcion-corta'] || ''}</td>
                <td>${p['descripcion-larga'] || ''}</td>
                <td>${p.envio ? 'Sí' : 'No'}</td>
                <td><img src="${imgSrc}" alt="${p.nombre||''}" width="50" onerror="this.onerror=null; this.src='https://via.placeholder.com/50?text=No';"></td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    // Cargar productos desde el backend
    if (window.API_CONFIG) {
        fetch(window.API_CONFIG.getProductosUrl())
            .then(r => {
                if (!r.ok) throw new Error('Error al cargar');
                return r.json();
            })
            .then(result => { 
                const productos = result.data || result;
                window.productos = productos; 
                renderizarTabla(); 
            })
            .catch(() => renderizarTabla());
    } else {
        renderizarTabla();
    }

    // simple validation helpers
    function validateField(field){
        const el = form[field];
        if (!el) return true;
        const val = el.value.trim();
        let ok = true, msg = '';
        if (['nombre','marca','categoria'].includes(field)) {
            if (!val) { ok=false; msg='Requerido'; }
        }
        if (field === 'precio') {
            const n = Number(val);
            if (!val || isNaN(n) || n <= 0) { ok=false; msg='Precio inválido'; }
        }
        if (field === 'stock') {
            const n = Number(val);
            if (!val || isNaN(n) || n < 0) { ok=false; msg='Stock inválido'; }
        }
        // show error
        let err = el.nextElementSibling;
        if (!err || !err.classList || !err.classList.contains('field-error')){
            err = document.createElement('div'); err.className='field-error'; el.parentNode.insertBefore(err, el.nextSibling);
        }
        err.innerText = ok ? '' : msg;
        return ok;
    }

    // on blur validate
    ['nombre','precio','stock','marca','categoria'].forEach(f => {
        const el = form[f]; if (!el) return;
        el.addEventListener('blur', ()=> validateField(f));
    });

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const fields = ['nombre','precio','stock','marca','categoria'];
        const allOk = fields.map(f=> validateField(f)).every(Boolean);
        if (!allOk) { if (typeof showToast === 'function') showToast('Corrija los errores antes de enviar'); return; }

        const nuevoProducto = {
            nombre: form.nombre.value,
            precio: Number(form.precio.value),
            stock: Number(form.stock.value),
            marca: form.marca.value,
            categoria: form.categoria.value,
            'descripcion-corta': form['descripcion-corta'] ? form['descripcion-corta'].value : '',
            'descripcion-larga': form['descripcion-larga'] ? form['descripcion-larga'].value : '',
            envio: form.envio ? form.envio.checked : false,
            foto: form.foto ? form.foto.value.trim() : '',
            imagen: form.foto ? form.foto.value.trim() : '' // Enviar también como 'imagen'
        };
        
        console.log('📸 URL de la foto que se va a enviar:', nuevoProducto.foto);
        console.log('📦 Producto completo a enviar:', nuevoProducto);

        // Enviar producto al backend
        if (window.API_CONFIG) {
            (async ()=>{
                try {
                    console.log('📤 Enviando producto al backend...');
                    const res = await fetch(window.API_CONFIG.getProductosUrl(), { 
                        method: 'POST', 
                        headers: {'Content-Type':'application/json'}, 
                        body: JSON.stringify(nuevoProducto) 
                    });
                    
                    if (res.ok) {
                        const result = await res.json();
                        const saved = result.data || result;
                        console.log('✅ Producto guardado:', saved);
                        
                        // Agregar a la lista local
                        window.productos = window.productos || [];
                        window.productos.push(saved);
                        renderizarTabla();
                        form.reset();
                        
                        alert('✅ Producto creado exitosamente');
                    } else {
                        const error = await res.json();
                        console.error('❌ Error del servidor:', error);
                        alert('❌ Error: ' + (error.message || 'No se pudo guardar'));
                    }
                } catch (err) {
                    console.error('❌ Error de conexión:', err);
                    alert('❌ Error de conexión con el servidor');
                }
            })();
        } else {
            // Fallback: guardar solo localmente
            productos.push(nuevoProducto);
            renderizarTabla();
            form.reset();
            alert('⚠️ Producto guardado solo localmente (backend no configurado)');
        }
    });
}

// auto-run if loaded standalone
if (document.readyState === 'complete' || document.readyState === 'interactive') initAlta();