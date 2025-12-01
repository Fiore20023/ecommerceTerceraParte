// ------------------------------------------------
//             Producto Detalle
// ------------------------------------------------

function initProductoDetalle() {
    console.log('📄 Inicializando página de detalle de producto');
    
    const wrapper = document.getElementById('producto-detalle-wrapper');
    if (!wrapper) {
        console.error('No se encontró el contenedor del producto');
        return;
    }
    
    // Obtener el ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');
    
    if (!productoId) {
        wrapper.innerHTML = `
            <div class="producto-detalle-container">
                <h2 style="color:#dc3545; text-align:center;">❌ No se especificó un producto</h2>
                <div style="text-align:center; margin-top:2rem;">
                    <a href="index.html" class="btn-volver">⬅️ Volver al inicio</a>
                </div>
            </div>
        `;
        return;
    }
    
    console.log('🔍 Cargando producto con ID:', productoId);
    
    // Cargar el producto desde el backend
    if (window.API_CONFIG) {
        fetch(window.API_CONFIG.getProductoByIdUrl(productoId))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                return response.json();
            })
            .then(result => {
                console.log('✅ Producto cargado:', result);
                const producto = result.data || result;
                renderProductoDetalle(producto);
            })
            .catch(error => {
                console.error('❌ Error al cargar producto:', error);
                wrapper.innerHTML = `
                    <div class="producto-detalle-container">
                        <h2 style="color:#dc3545; text-align:center;">❌ Error al cargar el producto</h2>
                        <p style="text-align:center; color:#666;">${error.message}</p>
                        <div style="text-align:center; margin-top:2rem;">
                            <a href="index.html" class="btn-volver">⬅️ Volver al inicio</a>
                        </div>
                    </div>
                `;
            });
    } else {
        console.error('❌ API_CONFIG no está disponible');
        wrapper.innerHTML = `
            <div class="producto-detalle-container">
                <h2 style="color:#dc3545; text-align:center;">❌ Error de configuración</h2>
                <div style="text-align:center; margin-top:2rem;">
                    <a href="index.html" class="btn-volver">⬅️ Volver al inicio</a>
                </div>
            </div>
        `;
    }
}

function renderProductoDetalle(producto) {
    const wrapper = document.getElementById('producto-detalle-wrapper');
    
    // Determinar imagen a mostrar
    let imagenUrl = producto.foto || producto.imagen;
    if (!imagenUrl || imagenUrl === '' || imagenUrl === 'undefined') {
        imagenUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500"%3E%3Crect fill="%2328a745" width="500" height="500"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin Imagen%3C/text%3E%3C/svg%3E';
    }
    
    // Determinar clase de stock
    let stockClass = 'stock-disponible';
    let stockTexto = `✅ En stock: ${producto.stock} unidades`;
    
    if (producto.stock === 0) {
        stockClass = 'sin-stock';
        stockTexto = '❌ Sin stock';
    } else if (producto.stock < 5) {
        stockClass = 'stock-bajo';
        stockTexto = `⚠️ Stock limitado: ${producto.stock} unidades`;
    }
    
    // Determinar envío
    const envioHtml = producto.envio 
        ? '<div class="producto-envio envio-gratis">🚚 ✅ Envío gratis disponible</div>'
        : '<div class="producto-envio">🚚 Envío no incluido</div>';
    
    // Renderizar el HTML del producto
    wrapper.innerHTML = `
        <div class="producto-detalle-container">
            <div class="producto-detalle-content">
                <div class="producto-imagen-container">
                    <img src="${imagenUrl}" 
                         alt="${producto.nombre}" 
                         class="producto-imagen-principal"
                         onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22%3E%3Crect fill=%22%2328a745%22 width=%22500%22 height=%22500%22/%3E%3Ctext fill=%22%23ffffff%22 font-family=%22Arial%22 font-size=%2224%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin Imagen%3C/text%3E%3C/svg%3E';">
                </div>
                
                <div class="producto-info">
                    <h1 class="producto-titulo">${producto.nombre}</h1>
                    
                    <div class="producto-precio">$${Number(producto.precio).toLocaleString('es-AR')}</div>
                    
                    <div class="producto-stock ${stockClass}">${stockTexto}</div>
                    
                    ${producto.marca ? `
                        <div class="producto-atributo">
                            <div class="producto-atributo-label">Marca</div>
                            <div class="producto-atributo-valor">${producto.marca}</div>
                        </div>
                    ` : ''}
                    
                    ${producto.categoria ? `
                        <div class="producto-atributo">
                            <div class="producto-atributo-label">Categoría</div>
                            <div class="producto-atributo-valor">${producto.categoria}</div>
                        </div>
                    ` : ''}
                    
                    ${envioHtml}
                    
                    <div class="producto-acciones">
                        <button class="btn-comprar" onclick="comprarProducto()" ${producto.stock === 0 ? 'disabled' : ''}>
                            🛒 ${producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                        </button>
                        <button onclick="window.location.href='index.html'" class="btn-volver">⬅️ Volver</button>
                    </div>
                </div>
                
                ${(producto.detalles || producto.descripcion || producto['descripcion-corta']) ? `
                    <div class="producto-descripcion">
                        <h2>📋 Descripción del producto</h2>
                        <p>${producto.detalles || producto.descripcion || producto['descripcion-corta']}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Guardar el producto en window para usarlo en comprarProducto()
    window.currentProducto = producto;
}

function comprarProducto() {
    if (!window.currentProducto) {
        alert('❌ Error: Producto no disponible');
        return;
    }
    
    if (window.currentProducto.stock === 0) {
        alert('❌ Este producto no tiene stock disponible');
        return;
    }
    
    console.log('🛒 Agregando al carrito:', window.currentProducto);
    
    if (typeof window.addToCart === 'function') {
        window.addToCart(window.currentProducto);
    } else {
        alert('❌ Error: Función de carrito no disponible');
    }
}

// Auto-inicializar
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initProductoDetalle, 100);
} else {
    document.addEventListener('DOMContentLoaded', initProductoDetalle);
}
