// ------------------------------------------------
//             variables globales
// ------------------------------------------------

// ------------------------------------------------
//             funciones globales
// ------------------------------------------------
/*function representarCardsProductos() {
    var cards = ''

    if(productos.length) {
        for(var i=0; i<productos.length; i++) {
            var producto = productos[i]
            cards +=
                '<section>' +
                    '<h3>' + producto.nombre + '</h3>' +
                    '<img src="' + producto.foto + '" alt="foto de ' + producto.nombre + ' ' + producto.marca + '">' +
                    '<p><b>Precio: </b>$' + producto.precio + '</p>' +
                    '<p><b>Stock: </b>' + producto.stock + '</p>' +
                    '<p><b>Marca: </b>' + producto.marca + '</p>' +
                    '<p><b>Categoría: </b>' + producto.categoria + '</p>' +
                    '<p><b>Detalles: </b>' + producto.detalles + '</p>' +
                    '<br>' + 
                    '<p><b style="color:gold;">Envío: </b>' + (producto.envio? 'Si' : 'No') + '</p>' +
                '</section>'
        }
    }
    else cards += '<h2>No se encontraron productos para mostrar</h2>'

    document.querySelector('.section-cards-body').innerHTML = cards
}

function start() {
    console.warn( document.querySelector('title').innerText )

    representarCardsProductos()
}*/



//nuevo


function initInicio(){
    console.log('🔵 initInicio ejecutándose');
    const cardsContainer = document.querySelector('.cards-container');
    if(!cardsContainer) {
        console.warn('No se encontró .cards-container');
        return;
    }
    
    cardsContainer.innerHTML = '<p style="text-align:center; padding:2rem;">Cargando productos...</p>';

    const renderProducts = (list) => {
        console.log('🎨 Renderizando productos:', list);
        cardsContainer.innerHTML = '';
        
        if (!list || list.length === 0) {
            cardsContainer.innerHTML = '<p style="text-align:center; padding:2rem; color:#666;">No hay productos disponibles. Ve a "Alta" para agregar productos.</p>';
            return;
        }
        
        list.forEach((producto, index) => {
            console.log(`Producto ${index}:`, producto);
            
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cssText = 'border:1px solid #ddd; border-radius:8px; padding:1rem; margin:1rem; cursor:pointer; transition: transform 0.2s, box-shadow 0.2s;';
            
            // Agregar efecto hover
            card.onmouseenter = function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            };
            card.onmouseleave = function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            };
            
            // Click en la card para ir al detalle
            card.onclick = function(e) {
                // Si el click fue en el botón de comprar, no redirigir
                if (e.target.classList.contains('card-buy-button')) {
                    return;
                }
                window.location.href = `producto-detalle.html?id=${producto.id || producto._id}`;
            };
            
            // Crear botón de comprar
            const btnComprar = document.createElement('button');
            btnComprar.textContent = '🛒 Comprar';
            btnComprar.className = 'card-buy-button';
            btnComprar.style.cssText = 'background:#dc3545; color:white; border:none; padding:0.8rem 1.5rem; border-radius:5px; cursor:pointer; font-size:1rem; font-weight:bold;';
            
            // Si la imagen está vacía o es undefined, usar placeholder local
            let imagenUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2328a745" width="300" height="200"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin Imagen%3C/text%3E%3C/svg%3E';
            
            if (producto.foto && producto.foto !== '' && producto.foto !== 'undefined') {
                imagenUrl = producto.foto;
            } else if (producto.imagen && producto.imagen !== '' && producto.imagen !== 'undefined') {
                imagenUrl = producto.imagen;
            }
            
            console.log('🖼️ Imagen URL para', producto.nombre, ':', imagenUrl);
            
            card.innerHTML = `
                <img src="${imagenUrl}" 
                     alt="${producto.nombre}" 
                     style="width:100%; height:200px; object-fit:cover; border-radius:4px; background:#f0f0f0;"
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%2328a745%22 width=%22300%22 height=%22200%22/%3E%3Ctext fill=%22%23ffffff%22 font-family=%22Arial%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin Imagen%3C/text%3E%3C/svg%3E';">
                <div class="card-body" style="padding:1rem 0;">
                    <h3 class="card-title" style="margin:0.5rem 0; color:#333;">${producto.nombre}</h3>
                    <p class="card-price" style="font-size:1.5rem; color:#28a745; font-weight:bold; margin:0.5rem 0;">$${producto.precio}</p>
                    <p class="card-description" style="color:#666; margin:0.5rem 0;">${producto['descripcion-corta'] || producto.descripcion || 'Sin descripción'}</p>
                    <a href="producto-detalle.html?id=${producto.id || producto._id}" style="color:#007bff; text-decoration:none; font-size:0.9rem;">👁️ Ver detalle completo →</a>
                </div>
            `;
            
            card.appendChild(btnComprar);
            
            // Agregar evento directamente
            btnComprar.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Click en botón comprar, producto:', producto);
                
                if (typeof window.addToCart === 'function') {
                    console.log('✅ Llamando a window.addToCart');
                    window.addToCart(producto);
                } else {
                    console.error('❌ window.addToCart NO está definida');
                    alert('Error: La función addToCart no está disponible');
                }
            };
            
            cardsContainer.appendChild(card);
        });
        
        console.log('✅ Productos renderizados');
    };

    // Cargar productos desde el backend
    if (window.API_CONFIG) {
        console.log('📡 Cargando productos desde el backend...');
        fetch(window.API_CONFIG.getProductosUrl())
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar productos');
                return response.json();
            })
            .then(result => {
                console.log('✅ Productos cargados del backend:', result);
                const productos = result.data || result;
                window.productos = productos;
                renderProducts(productos);
            })
            .catch(error => {
                console.warn('⚠️ Error cargando desde backend:', error);
                renderProducts(window.productos || []);
            });
    } else {
        console.log('📦 Usando productos locales');
        renderProducts(window.productos || []);
    }
}

// auto-run if loaded standalone
console.log('📄 inicio.js cargado, readyState:', document.readyState);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('⚡ Ejecutando initInicio inmediatamente');
    setTimeout(initInicio, 100);
} else {
    console.log('⏳ Esperando DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initInicio);
}