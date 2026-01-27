// ------------------------------------------------
//             ALTA.JS - Gestión de productos
// ------------------------------------------------

function initAlta(){
    console.log('🔵 initAlta ejecutándose');
    console.log('🔧 window.API_CONFIG:', window.API_CONFIG);
    console.log('📍 BASE_URL:', window.API_CONFIG?.BASE_URL);
    console.log('📍 getProductosUrl():', window.API_CONFIG?.getProductosUrl());
    
    const form = document.getElementById('form-alta-producto');
    const tablaBody = document.querySelector('#tabla-productos tbody');
    
    console.log('📋 Form encontrado:', !!form);
    console.log('📊 Tabla body encontrado:', !!tablaBody);
    
    if (!form) {
        console.error('❌ No se encontró el formulario');
        return;
    }
    
    if (!window.API_CONFIG) {
        console.error('❌ API_CONFIG no disponible. Esperando...');
        // Intentar de nuevo después de 1 segundo
        setTimeout(initAlta, 1000);
        return;
    }
    
    let todosLosProductos = []; // Para filtrado

    // Formatear montos con separadores de miles
    function formatMoney(value, fractionDigits = 0){
        const num = Number(value) || 0;
        return num.toLocaleString('es-AR', {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        });
    }
    
    // MANEJO DEL CAMBIO ENTRE TIPO AUTO Y PRODUCTO
    const tipoAuto = document.getElementById('tipo-auto');
    const tipoProducto = document.getElementById('tipo-producto');
    const camposAuto = document.getElementById('campos-auto');
    const camposProductoDiv = document.getElementById('campos-producto');
    
    console.log('🔍 Radio Auto encontrado:', !!tipoAuto);
    console.log('🔍 Radio Producto encontrado:', !!tipoProducto);
    console.log('🔍 Campos Auto encontrado:', !!camposAuto);
    console.log('🔍 Campos Producto encontrado:', !!camposProductoDiv);
    
    let selectedModelosCached = []; // Para guardar modelos cuando cambias de tipo
    
    function cambiarTipoProducto() {
        const esAuto = tipoAuto && tipoAuto.checked;
        console.log('🔄 Cambiando a:', esAuto ? 'AUTO' : 'PRODUCTO');
        
        // Guardar modelos seleccionados ANTES de ocultar
        if (!esAuto && document.getElementById('campos-producto').style.display !== 'none') {
            selectedModelosCached = Array.from(document.querySelectorAll('input[name="modelos"]:checked')).map(cb => cb.value);
            console.log('💾 Guardando modelos:', selectedModelosCached);
        }
        
        // Restaurar modelos cuando vuelves a PRODUCTO
        if (!esAuto && document.getElementById('campos-producto').style.display === 'none') {
            setTimeout(() => {
                selectedModelosCached.forEach(modelo => {
                    const checkbox = document.querySelector(`input[name="modelos"][value="${modelo}"]`);
                    if (checkbox) checkbox.checked = true;
                });
                console.log('♻️ Restaurando modelos:', selectedModelosCached);
            }, 0);
        }
        
        if (camposAuto) {
            camposAuto.style.display = esAuto ? 'block' : 'none';
            // Ajustar required de campos de auto
            const tituloAuto = document.getElementById('titulo-auto');
            const precioAuto = document.getElementById('precio-auto');
            const estadoAuto = document.getElementById('estado-auto');
            const kilometrosAuto = document.getElementById('kilometros-auto');
            const marcaAuto = document.getElementById('marca-auto');
            
            if (tituloAuto) tituloAuto.required = esAuto;
            if (precioAuto) precioAuto.required = esAuto;
            if (estadoAuto) estadoAuto.required = esAuto;
            if (kilometrosAuto) kilometrosAuto.required = esAuto;
            if (marcaAuto) marcaAuto.required = esAuto;
        }
        
        if (camposProductoDiv) {
            camposProductoDiv.style.display = esAuto ? 'none' : 'block';
            // Ajustar required de campos de producto
            const tipoProductoSelect = document.getElementById('tipo-producto-select');
            const tituloProducto = document.getElementById('titulo-producto');
            const precioProducto = document.getElementById('precio-producto');
            const stockProducto = document.getElementById('stock-producto');
            if (tipoProductoSelect) tipoProductoSelect.required = !esAuto;
            if (tituloProducto) tituloProducto.required = !esAuto;
            if (precioProducto) precioProducto.required = !esAuto;
            if (stockProducto) stockProducto.required = !esAuto;
        }
    }
    
    if (tipoAuto) {
        console.log('✅ Agregando listener a tipo-auto');
        tipoAuto.addEventListener('change', cambiarTipoProducto);
    }
    if (tipoProducto) {
        console.log('✅ Agregando listener a tipo-producto');
        tipoProducto.addEventListener('change', cambiarTipoProducto);
    }
    
    // Ejecutar al cargar
    console.log('⚡ Ejecutando cambiarTipoProducto inicial');
    cambiarTipoProducto();
    
    // MANEJAR SELECT COLOR "OTRO" PARA AUTOS
    const colorAutoSelect = document.getElementById('color-auto');
    const colorAutoOtroGroup = document.getElementById('color-auto-otro-group');
    if (colorAutoSelect && colorAutoOtroGroup) {
        colorAutoSelect.addEventListener('change', (e) => {
            colorAutoOtroGroup.style.display = e.target.value === 'otro' ? 'block' : 'none';
        });
    }
    
    // MANEJAR SELECT COLOR "OTRO" PARA PRODUCTOS
    const colorProductoSelect = document.getElementById('color-producto');
    const colorProductoOtroGroup = document.getElementById('color-producto-otro-group');
    if (colorProductoSelect && colorProductoOtroGroup) {
        colorProductoSelect.addEventListener('change', (e) => {
            colorProductoOtroGroup.style.display = e.target.value === 'otro' ? 'block' : 'none';
        });
    }
    
    // MANEJAR CHECKBOX "TODOS" EN MODELOS
    const checkboxTodos = document.querySelector('input[name="modelos"][value="Todos"]');
    const checkboxesModelos = Array.from(document.querySelectorAll('input[name="modelos"]:not([value="Todos"])'));
    
    if (checkboxTodos) {
        checkboxTodos.addEventListener('change', (e) => {
            checkboxesModelos.forEach(cb => cb.checked = e.target.checked);
        });
    }
    
    // Si se desmarca alguno individualmente, desmarcar "Todos"
    checkboxesModelos.forEach(cb => {
        cb.addEventListener('change', () => {
            if (!cb.checked && checkboxTodos) {
                checkboxTodos.checked = false;
            }
            // Si todos están marcados, marcar "Todos"
            if (checkboxesModelos.every(c => c.checked) && checkboxTodos) {
                checkboxTodos.checked = true;
            }
        });
    });
    
    // PREVIEW DE IMÁGENES
    const inputImagenes = document.getElementById('imagenes');
    const previewContainer = document.getElementById('preview-imagenes');
    
    if (inputImagenes && previewContainer) {
        inputImagenes.addEventListener('change', (e) => {
            if (window.uploadImages) {
                window.uploadImages.mostrarPreviewImagenes(e.target.files, previewContainer);
            }
        });
    }
    
    function renderizarTabla(productosFiltrados = null) {
        console.log('🎨 Renderizando tabla con productos:', productosFiltrados || window.productos);
        if (!tablaBody) {
            console.error('❌ tablaBody no existe');
            return;
        }
        tablaBody.innerHTML = ''; // Limpiar la tabla antes de renderizar
        const list = productosFiltrados || window.productos || [];
        
        console.log(`📦 Productos a renderizar: ${list.length}`);
        
        // Calcular totales
        const totalProductos = list.length;
        const totalAutos = list.filter(p => p.tipoProducto === 'auto').length;
        const totalRepuestos = list.filter(p => p.tipoProducto !== 'auto').length;
        
        // Mostrar totales en el contenedor
        const totalesDiv = document.getElementById('totales-productos');
        if (totalesDiv) {
            totalesDiv.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #007bff;">${totalProductos}</div>
                    <div style="font-size: 0.9rem; color: #666;">Total Productos</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #28a745;">${totalAutos}</div>
                    <div style="font-size: 0.9rem; color: #666;">Autos</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #ffc107;">${totalRepuestos}</div>
                    <div style="font-size: 0.9rem; color: #666;">Repuestos</div>
                </div>
            `;
        }
        
        if (list.length === 0) {
            const fila = document.createElement('tr');
            fila.innerHTML = `<td colspan="10" style="text-align:center; padding:2rem; color:#666;">No hay productos disponibles</td>`;
            tablaBody.appendChild(fila);
            return;
        }
        
        list.forEach(p => {
            const fila = document.createElement('tr');
            
            // Determinar tipo de producto
            const tipo = p.tipoProducto === 'auto' ? '🚗 Auto' : '🔧 Producto';
            
            // Modelo(s)
            let modelos = '';
            if (p.tipoProducto === 'auto') {
                modelos = p.modeloAuto || p.categoria || '-';
            } else {
                modelos = Array.isArray(p.modelos) ? p.modelos.join(', ') : (p.categoria || '-');
            }
            
            // Stock - simplificado solo para stock
            let stockTexto;
            if (p.tipoProducto === 'auto') {
                stockTexto = p.estadoStock || 'disponible';
            } else {
                stockTexto = p.stock || 0;
            }
            
            // Categoría muestra el tipo de producto
            let categoriaTexto = '-';
            if (p.tipoProducto === 'auto') {
                categoriaTexto = 'Auto';
            } else {
                categoriaTexto = p.subcategoria || p.categoria || 'Producto';
            }
            
            // Imágenes
            let imagenesHTML = '';
            if (p.imagenes && p.imagenes.length > 0) {
                const primeraImagen = p.imagenes[0].datos || p.imagenes[0];
                imagenesHTML = `<img src="${primeraImagen}" alt="${p.nombre}" width="60" style="border-radius:4px; object-fit:cover; height:60px;">
                                <small style="display:block; text-align:center; color:#666;">${p.imagenes.length} foto(s)</small>`;
            } else {
                const imgFallback = p.foto || p.imagen || '';
                if (imgFallback) {
                    imagenesHTML = `<img src="${imgFallback}" alt="${p.nombre}" width="60" style="border-radius:4px;">`;
                } else {
                    imagenesHTML = '<small style="color:#999;">Sin imagen</small>';
                }
            }
            
            // Moneda
            const moneda = p.moneda === 'USD' ? 'USD' : 'ARS';
            
            const estaOculto = p.oculto === true;

            fila.innerHTML = `
                <td style="text-align:center;">${tipo}</td>
                <td><strong>${p.nombre || ''}</strong></td>
                <td style="text-align:right; color:#28a745; font-weight:bold;">${moneda} $${formatMoney(p.precio)}</td>
                <td>${modelos}</td>
                <td>${categoriaTexto}</td>
                <td style="text-align:center;"><strong>${stockTexto}</strong></td>
                <td style="text-align:center;">${imagenesHTML}</td>
                <td style="white-space:nowrap;">
                    <button class="btn-editar" data-id="${p._id}" title="Editar producto" style="background:#ffc107; color:#000; border:none; padding:0.4rem 0.6rem; margin:0 0.3rem; cursor:pointer; border-radius:4px; font-size:1rem;">✏️</button>
                    <label class="switch-container" title="${estaOculto ? 'Producto oculto' : 'Producto visible'}">
                        <input type="checkbox" class="switch-checkbox" data-id="${p._id}" ${estaOculto ? '' : 'checked'}>
                        <span class="switch-slider"></span>
                    </label>
                    <button class="btn-eliminar" data-id="${p._id}" title="Eliminar producto" style="background:#dc3545; color:#fff; border:none; padding:0.4rem 0.6rem; margin:0 0.3rem; cursor:pointer; border-radius:4px; font-size:1rem;">❌</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    // Event listeners para botones de editar y eliminar
    tablaBody.addEventListener('click', async (e) => {
        const btnEditar = e.target.closest('.btn-editar');
        const btnEliminar = e.target.closest('.btn-eliminar');
        
        if (btnEditar) {
            const id = btnEditar.dataset.id;
            const producto = window.productos.find(p => p._id === id);
            if (!producto) return;
            
            // Determinar tipo de producto y seleccionar radio correspondiente
            const esAuto = producto.tipoProducto === 'auto';
            const radioAuto = document.getElementById('tipo-auto');
            const radioProducto = document.getElementById('tipo-producto');
            
            if (esAuto) {
                radioAuto.checked = true;
            } else {
                radioProducto.checked = true;
            }
            cambiarTipoProducto(); // Mostrar campos correspondientes
            
            // LLENAR CAMPOS SEGÚN TIPO
            if (esAuto) {
                // Campos específicos de auto
                document.getElementById('titulo-auto').value = producto.nombre || '';
                document.getElementById('precio-auto').value = producto.precio || '';
                document.getElementById('moneda-auto').value = producto.moneda || 'ARS';
                document.getElementById('estado-auto').value = producto.estadoStock || 'disponible';
                document.getElementById('kilometros-auto').value = producto.kilometros || 0;
                document.getElementById('marca-auto').value = producto.marca || producto.modeloAuto || producto.categoria || '';
                
                // Color (verificar si es "otro")
                const colorAuto = producto.colorAuto || '';
                const colorSelect = document.getElementById('color-auto');
                const opcionExiste = Array.from(colorSelect.options).some(opt => opt.value === colorAuto);
                if (opcionExiste && colorAuto !== 'otro') {
                    colorSelect.value = colorAuto;
                } else if (colorAuto) {
                    colorSelect.value = 'otro';
                    document.getElementById('color-auto-otro').value = colorAuto;
                    document.getElementById('color-auto-otro-group').style.display = 'block';
                }
                
                document.getElementById('descripcion-auto').value = producto.descripcionAuto || producto.descripcion || '';
                const checkEnvioExterior = document.getElementById('envio-exterior-auto');
                if (checkEnvioExterior) checkEnvioExterior.checked = producto.envioExterior || false;
            } else {
                // Campos específicos de producto
                const tipoSelect = document.getElementById('tipo-producto-select');
                if (tipoSelect) tipoSelect.value = producto.subcategoria || '';
                
                document.getElementById('titulo-producto').value = producto.nombre || '';
                document.getElementById('precio-producto').value = producto.precio || '';
                document.getElementById('moneda-producto').value = producto.moneda || 'ARS';
                document.getElementById('stock-producto').value = producto.stock || '';
                const marcaProducto = document.getElementById('marca-producto');
                if (marcaProducto) marcaProducto.value = producto.marca || '';
                
                // Marcar modelos compatibles
                if (Array.isArray(producto.modelos)) {
                    document.querySelectorAll('input[name="modelos"]').forEach(cb => {
                        cb.checked = producto.modelos.includes(cb.value);
                    });
                }
                
                // Color (verificar si es "otro")
                const colorProducto = producto.color || '';
                const colorProductoSelect = document.getElementById('color-producto');
                const opcionProductoExiste = Array.from(colorProductoSelect.options).some(opt => opt.value === colorProducto);
                if (opcionProductoExiste && colorProducto !== 'otro') {
                    colorProductoSelect.value = colorProducto;
                } else if (colorProducto) {
                    colorProductoSelect.value = 'otro';
                    document.getElementById('color-producto-otro').value = colorProducto;
                    document.getElementById('color-producto-otro-group').style.display = 'block';
                }
                
                const tamanoInput = document.getElementById('tamano');
                if (tamanoInput) tamanoInput.value = producto.tamano || '';
                
                const descProducto = document.getElementById('descripcion-producto');
                if (descProducto) descProducto.value = producto.descripcion || producto['descripcion-corta'] || '';
                
                const envioProducto = document.getElementById('envio-producto');
                if (envioProducto) envioProducto.checked = producto.envio || false;
            }
            
            // Destacado (común para ambos)
            const checkDestacado = document.getElementById('destacado');
            if (checkDestacado) checkDestacado.checked = producto.destacado || false;
            
            // Mostrar imágenes existentes en preview
            const previewDiv = document.getElementById('preview-imagenes');
            if (producto.imagenes && producto.imagenes.length > 0) {
                previewDiv.innerHTML = '<p style="font-size:0.9rem; color:#666;">📷 Imágenes actuales: ' + producto.imagenes.length + ' foto(s). Carga nuevas para reemplazarlas.</p>';
            }
            
            // Cambiar el botón a "Actualizar"
            const btnSubmit = form.querySelector('button[type="submit"]');
            btnSubmit.textContent = 'Actualizar';
            btnSubmit.dataset.editId = id;
            
            // Scroll al formulario
            form.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (btnEliminar) {
            const id = btnEliminar.dataset.id;
            const producto = window.productos.find(p => p._id === id);
            
            if (!confirm(`¿Estás seguro de eliminar "${producto?.nombre || 'este producto'}"?`)) return;
            
            if (window.API_CONFIG) {
                try {
                    const res = await fetch(`${window.API_CONFIG.getProductosUrl()}/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (res.ok) {
                        alert('✅ Producto eliminado exitosamente');

                        // Limpiar caché para que el front refleje cambios
                        localStorage.removeItem('productos_cache');
                        localStorage.removeItem('productos_cache_time');

                        // Recargar productos
                        const response = await fetch(window.API_CONFIG.getProductosUrl());
                        const result = await response.json();
                        window.productos = result.data || result;
                        todosLosProductos = window.productos;
                        renderizarTabla();
                    } else {
                        const error = await res.json();
                        alert('❌ Error: ' + (error.message || 'No se pudo eliminar'));
                    }
                } catch (err) {
                    console.error('Error:', err);
                    alert('❌ Error de conexión');
                }
            }
        }

        // Botón Suspender/Mostrar - Ahora con switch
        const switchCheckbox = e.target.closest('.switch-checkbox');
        if (switchCheckbox) {
            const id = switchCheckbox.dataset.id;
            const producto = window.productos.find(p => p._id === id);
            if (!producto) return;

            const nuevoEstado = !switchCheckbox.checked; // Si está checked, está visible; si no está checked, está oculto
            console.log('🔄 Cambiando estado de:', producto.nombre);
            console.log('   Estado actual oculto:', producto.oculto);
            console.log('   Nuevo estado oculto:', nuevoEstado);
            console.log('   Checkbox checked:', switchCheckbox.checked);
            
            const mensaje = nuevoEstado ? '¿Ocultar este producto (no aparecerá en la tienda)?' : '¿Mostrar este producto en la tienda?';
            if (!confirm(mensaje)) {
                // Revertir el cambio del checkbox si se cancela
                switchCheckbox.checked = !switchCheckbox.checked;
                return;
            }

            if (window.API_CONFIG) {
                try {
                    const productoActualizado = { ...producto, oculto: nuevoEstado };
                    console.log('📤 Enviando producto actualizado:', productoActualizado);
                    
                    const res = await fetch(`${window.API_CONFIG.getProductosUrl()}/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productoActualizado)
                    });
                    
                    console.log('📥 Respuesta del servidor:', res.status);
                    
                    if (res.ok) {
                        const resultData = await res.json();
                        console.log('✅ Producto actualizado exitosamente:', resultData);

                        // Limpiar caché del listado para reflejar el cambio
                        localStorage.removeItem('productos_cache');
                        localStorage.removeItem('productos_cache_time');

                        // Recargar productos
                        const response = await fetch(window.API_CONFIG.getProductosUrl());
                        const result = await response.json();
                        window.productos = result.data || result;
                        todosLosProductos = window.productos;
                        console.log('📦 Productos recargados. Total:', window.productos.length);
                        renderizarTabla();
                    } else {
                        const error = await res.json();
                        console.error('❌ Error del servidor:', error);
                        alert('❌ Error: ' + (error.message || 'No se pudo actualizar'));
                        // Revertir el cambio del checkbox si falla
                        switchCheckbox.checked = !switchCheckbox.checked;
                    }
                } catch (err) {
                    console.error('❌ Error de conexión:', err);
                    alert('❌ Error de conexión');
                    // Revertir el cambio del checkbox si falla
                    switchCheckbox.checked = !switchCheckbox.checked;
                }
            }
        }
    });

    // Cargar productos desde el backend
    console.log('📡 Intentando cargar productos...');
    console.log('🔧 API_CONFIG disponible:', !!window.API_CONFIG);
    
    if (window.API_CONFIG) {
        console.log('📍 URL de productos:', window.API_CONFIG.getProductosUrl());
        
        fetch(window.API_CONFIG.getProductosUrl())
            .then(r => {
                console.log('📥 Respuesta recibida, status:', r.status);
                if (!r.ok) throw new Error('Error al cargar');
                return r.json();
            })
            .then(result => { 
                console.log('✅ Datos parseados:', result);
                const productos = result.data || result;
                console.log('📦 Productos cargados en alta.js:', productos);
                console.log('📊 Total de productos:', productos.length);
                window.productos = productos;
                todosLosProductos = productos;
                renderizarTabla(); 
            })
            .catch((error) => {
                console.error('❌ Error cargando productos:', error);
                console.log('⚠️ Intentando renderizar con productos vacíos');
                window.productos = [];
                todosLosProductos = [];
                renderizarTabla();
            });
    } else {
        console.error('⚠️ API_CONFIG no disponible');
        window.productos = [];
        todosLosProductos = [];
        renderizarTabla();
    }

    // SUBMIT DEL FORMULARIO
    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        
        const btnSubmit = form.querySelector('button[type="submit"]');
        const editId = btnSubmit.dataset.editId;
        const isEdit = !!editId;
        
        // Determinar tipo de producto
        const tipoProductoValue = document.querySelector('input[name="tipoProducto"]:checked').value;
        
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Guardando...';
        
        try {
            let productoData = {
                tipoProducto: tipoProductoValue
            };
            
            // DATOS ESPECÍFICOS PARA AUTOS
            if (tipoProductoValue === 'auto') {
                productoData.nombre = document.getElementById('titulo-auto').value;
                productoData.precio = Number(document.getElementById('precio-auto').value);
                productoData.moneda = document.getElementById('moneda-auto').value;
                productoData.estadoStock = document.getElementById('estado-auto').value;
                productoData.stock = productoData.estadoStock === 'vendido' ? 0 : 1;
                productoData.kilometros = Number(document.getElementById('kilometros-auto').value) || 0;
                productoData.marca = document.getElementById('marca-auto').value;
                productoData.categoria = document.getElementById('marca-auto').value;
                productoData.modeloAuto = document.getElementById('marca-auto').value;
                
                // Color (con opción "otro")
                const colorAutoVal = document.getElementById('color-auto').value;
                if (colorAutoVal === 'otro') {
                    productoData.colorAuto = document.getElementById('color-auto-otro').value;
                } else {
                    productoData.colorAuto = colorAutoVal;
                }
                
                productoData.descripcion = document.getElementById('descripcion-auto').value;
                productoData.descripcionAuto = document.getElementById('descripcion-auto').value;
                productoData.envioExterior = document.getElementById('envio-exterior-auto').checked;
            }
            // DATOS ESPECÍFICOS PARA PRODUCTOS
            else {
                const tipoProductoSeleccionado = document.getElementById('tipo-producto-select').value;
                productoData.subcategoria = tipoProductoSeleccionado;
                productoData.categoria = tipoProductoSeleccionado; // Guardar la categoría de repuesto
                productoData.nombre = document.getElementById('titulo-producto').value;
                productoData.precio = Number(document.getElementById('precio-producto').value);
                productoData.moneda = document.getElementById('moneda-producto').value;
                productoData.stock = Number(document.getElementById('stock-producto').value);
                productoData.marca = document.getElementById('marca-producto').value;
                
                // Obtener modelos seleccionados (checkboxes)
                const modelosSeleccionados = Array.from(document.querySelectorAll('input[name="modelos"]:checked'))
                    .map(cb => cb.value)
                    .filter(v => v !== 'Todos'); // Excluir "Todos"
                
                console.log('🔍 Checkboxes encontrados:', document.querySelectorAll('input[name="modelos"]').length);
                console.log('✅ Checkboxes checkeados:', document.querySelectorAll('input[name="modelos"]:checked').length);
                console.log('📋 Modelos seleccionados:', modelosSeleccionados);
                
                productoData.modelos = modelosSeleccionados;
                
                // Color (con opción "otro")
                const colorProductoVal = document.getElementById('color-producto').value;
                if (colorProductoVal === 'otro') {
                    productoData.color = document.getElementById('color-producto-otro').value;
                } else {
                    productoData.color = colorProductoVal;
                }
                
                productoData.tamano = document.getElementById('tamano').value;
                productoData.descripcion = document.getElementById('descripcion-producto').value;
                productoData['descripcion-corta'] = document.getElementById('descripcion-producto').value;
                productoData['descripcion-larga'] = document.getElementById('descripcion-producto').value;
                productoData.envio = document.getElementById('envio-producto').checked;
            }
            
            // DESTACADO (común para ambos)
            productoData.destacado = document.getElementById('destacado').checked;
            
            // PROCESAR IMÁGENES
            const inputImagenes = document.getElementById('imagenes');
            if (inputImagenes && inputImagenes.files.length > 0 && window.uploadImages) {
                // Si hay nuevas imágenes, procesarlas
                console.log('📸 Procesando nuevas imágenes...');
                const imagenes = await window.uploadImages.convertirImagenesABase64(inputImagenes.files);
                productoData.imagenes = imagenes;
                console.log(`✅ ${imagenes.length} imágenes nuevas procesadas`);
            } else if (isEdit) {
                // Si es edición y NO hay nuevas imágenes, mantener las existentes
                const productoOriginal = window.productos.find(p => p._id === editId);
                if (productoOriginal && productoOriginal.imagenes) {
                    productoData.imagenes = productoOriginal.imagenes;
                    console.log('🔄 Manteniendo imágenes existentes:', productoData.imagenes.length);
                }
            }
            
            console.log('📦 Producto completo a enviar:', productoData);

            // Enviar producto al backend
            if (window.API_CONFIG) {
                const url = isEdit 
                    ? `${window.API_CONFIG.getProductosUrl()}/${editId}`
                    : window.API_CONFIG.getProductosUrl();
                const method = isEdit ? 'PUT' : 'POST';
                
                console.log(`📤 ${isEdit ? 'Actualizando' : 'Creando'} producto...`);
                const res = await fetch(url, { 
                    method: method, 
                    headers: {'Content-Type':'application/json'}, 
                    body: JSON.stringify(productoData) 
                });
                
                if (res.ok) {
                    const result = await res.json();
                    const saved = result.data || result;
                    console.log('✅ Producto guardado:', saved);
                    
                    // Recargar productos desde el backend
                    const response = await fetch(window.API_CONFIG.getProductosUrl());
                    const productsResult = await response.json();
                    window.productos = productsResult.data || productsResult;
                    todosLosProductos = window.productos;
                    renderizarTabla();
                    
                    // Resetear formulario
                    form.reset();
                    document.getElementById('preview-imagenes').innerHTML = '';
                    document.getElementById('color-auto-otro-group').style.display = 'none';
                    document.getElementById('color-producto-otro-group').style.display = 'none';
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Agregar';
                    delete btnSubmit.dataset.editId;
                    cambiarTipoProducto(); // Restaurar vista por defecto
                    
                    alert(`✅ Producto ${isEdit ? 'actualizado' : 'creado'} exitosamente`);
                } else {
                    const error = await res.json();
                    console.error('❌ Error del servidor:', error);
                    alert('❌ Error: ' + (error.message || 'No se pudo guardar'));
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = isEdit ? 'Actualizar' : 'Agregar';
                }
            } else {
                throw new Error('API_CONFIG no disponible');
            }
        } catch (err) {
            console.error('❌ Error:', err);
            alert('❌ Error: ' + err.message);
            btnSubmit.disabled = false;
            btnSubmit.textContent = isEdit ? 'Actualizar' : 'Agregar';
        }
    });

    // FILTRADO DE TABLA
    const filtroTabla = document.getElementById('filtro-tabla');
    if (filtroTabla) {
        filtroTabla.addEventListener('input', (e) => {
            const termino = (e.target.value || '').toLowerCase().trim();
            const productosFiltrados = todosLosProductos.filter(p => {
                const nombre = (p.nombre || '').toLowerCase();
                const marca = (p.marca || '').toLowerCase();
                const categoria = (p.categoria || '').toLowerCase();
                const detalles = (p.descripcion || p['descripcion-corta'] || '').toLowerCase();
                return nombre.includes(termino) || marca.includes(termino) || categoria.includes(termino) || detalles.includes(termino);
            });
            window.productos = productosFiltrados;
            renderizarTabla();
        });
    }

    const filtroTipo = document.getElementById('filtro-tipo');
    if (filtroTipo) {
        filtroTipo.addEventListener('change', (e) => {
            const tipo = e.target.value;
            const productosFiltrados = tipo === 'todos' 
                ? todosLosProductos 
                : todosLosProductos.filter(p => p.tipoProducto === tipo);
            window.productos = productosFiltrados;
            renderizarTabla();
        });
    }
}

// NO auto-ejecutar, esperar a que alta.html lo llame después de cargar todos los scripts
console.log('✅ alta.js definido, esperando llamada a initAlta()');



