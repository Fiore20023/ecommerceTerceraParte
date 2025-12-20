// ------------------------------------------------
//             variables globales
// ------------------------------------------------
let todosLosProductosGlobal = []; // Variable global para acceder desde funciones de filtrado

// ------------------------------------------------
//             funciones globales de filtrado
// ------------------------------------------------
function toggleDropdown(event, dropdownElement) {
    event.preventDefault();
    event.stopPropagation();
    
    // Cerrar todos los otros dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown !== dropdownElement) {
            dropdown.classList.remove('active');
        }
    });
    
    // Toggle el dropdown clickeado
    dropdownElement.classList.toggle('active');
}

function cerrarMenusDesplegables() {
    // Cerrar todos los menús desplegables
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown')) {
        cerrarMenusDesplegables();
    }
});

function filtrarPorModelo(modelo) {
    console.log('🚗 Filtrando por modelo:', modelo);
    cerrarMenusDesplegables(); // Cerrar menú
    const cardsContainer = document.querySelector('.cards-container');
    const inputBusqueda = document.getElementById('input-busqueda');
    
    if (inputBusqueda) {
        inputBusqueda.value = ''; // Limpiar búsqueda de texto
    }
    
    const productosFiltrados = todosLosProductosGlobal.filter(producto => {
        // Buscar en el array de modelos o en la categoría
        if (Array.isArray(producto.modelos)) {
            return producto.modelos.some(m => m.toLowerCase().includes(modelo.toLowerCase()));
        }
        // También buscar en categoria por si hay productos viejos
        const categoria = (producto.categoria || '').toLowerCase();
        return categoria.includes(modelo.toLowerCase());
    });
    
    console.log(`✅ Encontrados ${productosFiltrados.length} productos para modelo ${modelo}`);
    
    if (cardsContainer) {
        mostrarProductosFiltrados(productosFiltrados, `Modelo: ${modelo}`);
    }
}

function filtrarPorCategoria(categoria) {
    console.log('🛒 Filtrando por categoría:', categoria);
    cerrarMenusDesplegables(); // Cerrar menú
    const cardsContainer = document.querySelector('.cards-container');
    const inputBusqueda = document.getElementById('input-busqueda');
    
    if (inputBusqueda) {
        inputBusqueda.value = ''; // Limpiar búsqueda de texto
    }
    
    const productosFiltrados = todosLosProductosGlobal.filter(producto => {
        const subcategoria = (producto.subcategoria || '').toLowerCase();
        return subcategoria.includes(categoria.toLowerCase());
    });
    
    console.log(`✅ Encontrados ${productosFiltrados.length} productos para categoría ${categoria}`);
    
    if (cardsContainer) {
        mostrarProductosFiltrados(productosFiltrados, `Categoría: ${categoria}`);
    }
}

function mostrarProductosFiltrados(productos, titulo) {
    const cardsContainer = document.querySelector('.cards-container');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    
    if (productos.length === 0) {
        cardsContainer.innerHTML = `
            <p style="text-align:center; padding:2rem; color:#666; grid-column: 1 / -1;">
                No se encontraron productos para "<strong>${titulo}</strong>"
                <br><br>
                <button onclick="location.reload();" 
                        style="background:#28a745; color:white; padding:0.5rem 1rem; border:none; border-radius:5px; cursor:pointer;">
                    Ver todos los productos
                </button>
            </p>
        `;
        return;
    }
    
    // Agregar título de filtro
    const tituloFiltro = document.createElement('h2');
    tituloFiltro.textContent = `🔍 ${titulo}`;
    tituloFiltro.style.cssText = 'grid-column: 1 / -1; text-align: center; color: #007bff; background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%); padding: 1.5rem; margin: 1rem 0; border-radius: 10px; border: 2px solid #007bff; font-size: 2rem;';
    cardsContainer.appendChild(tituloFiltro);
    
    // Botón para volver a todos
    const btnVolver = document.createElement('button');
    btnVolver.textContent = '← Volver a todos los productos';
    btnVolver.style.cssText = 'grid-column: 1 / -1; background:#6c757d; color:white; padding:0.7rem 1.5rem; border:none; border-radius:5px; cursor:pointer; font-size:1rem; margin-bottom:1rem;';
    btnVolver.onclick = () => location.reload();
    cardsContainer.appendChild(btnVolver);
    
    // Renderizar productos filtrados
    productos.forEach(producto => {
        if (window.renderProductCardGlobal) {
            window.renderProductCardGlobal(producto);
        }
    });
}

// ------------------------------------------------
//             funciones globales anteriores
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
    
    let todosLosProductos = []; // Guardar todos los productos para filtrar
    
    cardsContainer.innerHTML = '<p style="text-align:center; padding:2rem;">Cargando productos...</p>';

    const renderProducts = (list) => {
        console.log('🎨 Renderizando productos:', list);
        cardsContainer.innerHTML = '';
        
        if (!list || list.length === 0) {
            cardsContainer.innerHTML = '<p style="text-align:center; padding:2rem; color:#666;">No se encontraron productos.</p>';
            return;
        }
        
        // Separar productos destacados y normales
        const destacados = list.filter(p => p.destacado === true);
        const normales = list.filter(p => !p.destacado);
        
        console.log(`⭐ ${destacados.length} destacados, 📦 ${normales.length} normales`);
        
        // Mostrar sección de destacados si hay
        if (destacados.length > 0) {
            const tituloDestacados = document.createElement('h2');
            tituloDestacados.textContent = '⭐ Productos Destacados';
            tituloDestacados.style.cssText = 'grid-column: 1 / -1; text-align: center; color: #ffc107; background: linear-gradient(135deg, #fff3cd 0%, #ffffff 100%); padding: 1.5rem; margin: 1rem 0; border-radius: 10px; border: 2px solid #ffc107; font-size: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);';
            cardsContainer.appendChild(tituloDestacados);
            
            destacados.forEach(producto => renderProductCard(producto));
            
            // Separador entre destacados y normales
            if (normales.length > 0) {
                const separador = document.createElement('hr');
                separador.style.cssText = 'grid-column: 1 / -1; margin: 2rem 0; border: none; border-top: 3px solid #ddd;';
                cardsContainer.appendChild(separador);
                
                const tituloNormales = document.createElement('h2');
                tituloNormales.textContent = '📦 Todos los Productos';
                tituloNormales.style.cssText = 'grid-column: 1 / -1; text-align: center; color: #333; padding: 1rem; margin: 1rem 0; font-size: 1.8rem;';
                cardsContainer.appendChild(tituloNormales);
            }
        }
        
        // Mostrar productos normales
        normales.forEach(producto => renderProductCard(producto));
        
        console.log('✅ Productos renderizados');
    };
    
    const renderProductCard = (producto) => {
        console.log(`Producto:`, producto);
            
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cssText = 'border:1px solid #ddd; border-radius:8px; padding:1rem; cursor:pointer; transition: transform 0.2s, box-shadow 0.2s;';
            
            // Si es destacado, agregar borde dorado
            if (producto.destacado) {
                card.style.border = '3px solid #ffc107';
                card.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
            }
            
            // Agregar efecto hover
            card.onmouseenter = function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = producto.destacado ? '0 8px 20px rgba(255, 193, 7, 0.5)' : '0 4px 12px rgba(0,0,0,0.15)';
            };
            card.onmouseleave = function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = producto.destacado ? '0 4px 12px rgba(255, 193, 7, 0.3)' : 'none';
            };
            
            // Click en la card para ir al detalle
            card.onclick = function(e) {
                // Si el click fue en el botón de comprar, no redirigir
                if (e.target.classList.contains('card-buy-button')) {
                    return;
                }
                const productoId = producto._id || producto.id;
                console.log('🔗 Navegando a detalle con ID:', productoId);
                window.location.href = `producto-detalle.html?id=${productoId}`;
            };
            
            // Determinar imagen a mostrar
            let imagenUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2328a745" width="300" height="200"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin Imagen%3C/text%3E%3C/svg%3E';
            
            // Prioridad: imagenes[0].datos > foto > imagen
            if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
                // Si hay imágenes en Base64
                imagenUrl = producto.imagenes[0].datos || producto.imagenes[0];
                console.log('📸 Usando imagen Base64 para:', producto.nombre);
            } else if (producto.foto && producto.foto !== '' && producto.foto !== 'undefined') {
                imagenUrl = producto.foto;
                console.log('📸 Usando foto para:', producto.nombre);
            } else if (producto.imagen && producto.imagen !== '' && producto.imagen !== 'undefined') {
                imagenUrl = producto.imagen;
                console.log('📸 Usando imagen para:', producto.nombre);
            }
            
            console.log('🖼️ Imagen final para', producto.nombre, ':', imagenUrl.substring(0, 50) + '...');
            
            // Crear botón de comprar solo si NO es auto
            const esAuto = producto.tipoProducto === 'auto';
            const btnComprar = document.createElement('button');
            
            if (esAuto) {
                btnComprar.textContent = '📞 Contactar';
                btnComprar.className = 'card-contact-button';
                btnComprar.style.cssText = 'background:#28a745; color:white; border:none; padding:0.8rem 1.5rem; border-radius:5px; cursor:pointer; font-size:1rem; font-weight:bold; width:100%; margin-top:1rem;';
            } else {
                btnComprar.textContent = '🛒 Comprar';
                btnComprar.className = 'card-buy-button';
                btnComprar.style.cssText = 'background:#dc3545; color:white; border:none; padding:0.8rem 1.5rem; border-radius:5px; cursor:pointer; font-size:1rem; font-weight:bold; width:100%; margin-top:1rem;';
            }
            
            // Badge de destacado
            const badgeDestacado = producto.destacado ? '<span style="position:absolute; top:10px; right:10px; background:#ffc107; color:#000; padding:0.3rem 0.6rem; border-radius:20px; font-size:0.8rem; font-weight:bold;">⭐ DESTACADO</span>' : '';
            
            card.innerHTML = `
                <div style="position:relative;">
                    ${badgeDestacado}
                    <img src="${imagenUrl}" 
                         alt="${producto.nombre}" 
                         style="width:100%; height:200px; object-fit:cover; border-radius:4px; background:#f0f0f0;"
                         onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%2328a745%22 width=%22300%22 height=%22200%22/%3E%3Ctext fill=%22%23ffffff%22 font-family=%22Arial%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin Imagen%3C/text%3E%3C/svg%3E';">
                </div>
                <div class="card-body" style="padding:1rem 0;">
                    <h3 class="card-title" style="margin:0.5rem 0; color:#333;">${producto.nombre}</h3>
                    <p class="card-price" style="font-size:1.5rem; color:#28a745; font-weight:bold; margin:0.5rem 0;">${producto.moneda || 'ARS'} $${producto.precio}</p>
                    <p class="card-description" style="color:#666; margin:0.5rem 0;">${producto['descripcion-corta'] || producto.descripcion || 'Sin descripción'}</p>
                    <a href="producto-detalle.html?id=${producto._id || producto.id}" style="color:#007bff; text-decoration:none; font-size:0.9rem;">👁️ Ver detalle completo →</a>
                </div>
            `;
            
            card.appendChild(btnComprar);
            
            // Agregar evento según tipo de producto
            btnComprar.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Click en botón, producto:', producto);
                
                if (esAuto) {
                    // Redirigir al detalle para contactar por WhatsApp
                    const productoId = producto._id || producto.id;
                    window.location.href = `producto-detalle.html?id=${productoId}`;
                } else {
                    // Agregar al carrito solo si NO es auto
                    if (typeof window.addToCart === 'function') {
                        console.log('✅ Llamando a window.addToCart');
                        window.addToCart(producto);
                    } else {
                        console.error('❌ window.addToCart NO está definida');
                        alert('Error: La función addToCart no está disponible');
                    }
                }
            };
            
            cardsContainer.appendChild(card);
    };
    
    // Exponer renderProductCard globalmente para usarlo en los filtros
    window.renderProductCardGlobal = renderProductCard;

    // FUNCIONALIDAD DE BÚSQUEDA
    const formBusqueda = document.getElementById('form-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');
    
    const filtrarProductos = (termino) => {
        console.log('🔍 Buscando:', termino);
        if (!termino || termino === '') {
            console.log('📋 Mostrando todos los productos');
            renderProducts(todosLosProductos);
            return;
        }
        
        const productosFiltrados = todosLosProductos.filter(producto => {
            const nombre = (producto.nombre || '').toLowerCase();
            const marca = (producto.marca || '').toLowerCase();
            const categoria = (producto.categoria || '').toLowerCase();
            const descripcion = (producto['descripcion-corta'] || producto.descripcion || '').toLowerCase();
            
            return nombre.includes(termino) || 
                   marca.includes(termino) || 
                   categoria.includes(termino) || 
                   descripcion.includes(termino);
        });
        
        console.log(`✅ Encontrados ${productosFiltrados.length} productos`);
        renderProducts(productosFiltrados);
        
        if (productosFiltrados.length === 0) {
            cardsContainer.innerHTML = `
                <p style="text-align:center; padding:2rem; color:#666;">
                    No se encontraron productos con "<strong>${termino}</strong>"
                    <br><br>
                    <button onclick="var input = document.getElementById('input-busqueda'); if(input) { input.value=''; input.dispatchEvent(new Event('input')); }" 
                            style="background:#28a745; color:white; padding:0.5rem 1rem; border:none; border-radius:5px; cursor:pointer;">
                        Ver todos los productos
                    </button>
                </p>
            `;
        }
    };
    
    if (formBusqueda && inputBusqueda) {
        console.log('🔍 Configurando buscador');
        
        // Buscar al enviar el formulario
        formBusqueda.addEventListener('submit', (e) => {
            e.preventDefault();
            const termino = inputBusqueda.value.trim().toLowerCase();
            console.log('📝 Submit búsqueda:', termino);
            filtrarProductos(termino);
        });
        
        // Buscar en tiempo real mientras se escribe
        inputBusqueda.addEventListener('input', (e) => {
            const termino = e.target.value.trim().toLowerCase();
            console.log('⌨️ Input búsqueda:', termino);
            filtrarProductos(termino);
        });
        
        console.log('✅ Buscador configurado');
    } else {
        console.warn('⚠️ No se encontró el formulario de búsqueda');
    }
    
    // Cargar productos desde el backend
    if (window.API_CONFIG) {
        console.log('📡 Cargando productos desde el backend...');
        
        // Timeout de 30 segundos para esperar que Heroku despierte
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        fetch(window.API_CONFIG.getProductosUrl(), { 
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error('Error al cargar productos');
                return response.json();
            })
            .then(result => {
                console.log('✅ Productos cargados del backend:', result);
                const productos = result.data || result;
                window.productos = productos;
                todosLosProductos = productos;
                todosLosProductosGlobal = productos;
                
                // Verificar si hay término de búsqueda en la URL
                const urlParams = new URLSearchParams(window.location.search);
                const terminoBusqueda = urlParams.get('busqueda');
                
                if (terminoBusqueda && inputBusqueda) {
                    inputBusqueda.value = terminoBusqueda;
                    filtrarProductos(terminoBusqueda);
                } else {
                    renderProducts(productos);
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.warn('⚠️ Error cargando desde backend:', error);
                
                // Mostrar mensaje más amigable
                const cardsContainer = document.querySelector('.cards-container');
                if (cardsContainer) {
                    cardsContainer.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                            <h2 style="color: #dc3545; margin-bottom: 1rem;">⏳ El servidor está iniciando...</h2>
                            <p style="color: #666; margin-bottom: 2rem;">
                                El backend puede tardar unos segundos en despertar.<br>
                                Por favor, esperá un momento y recargá la página.
                            </p>
                            <button onclick="location.reload()" 
                                    style="background: #28a745; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                                🔄 Recargar página
                            </button>
                        </div>
                    `;
                }
                
                todosLosProductos = window.productos || [];
                todosLosProductosGlobal = window.productos || [];
            });
    } else {
        console.log('📦 Usando productos locales');
        todosLosProductos = window.productos || [];
        todosLosProductosGlobal = window.productos || [];
        renderProducts(window.productos || []);
    }
}