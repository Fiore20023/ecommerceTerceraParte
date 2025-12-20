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
    
    // Determinar si es auto o producto
    const esAuto = producto.tipoProducto === 'auto';
    
    // Obtener todas las imágenes disponibles
    let imagenes = [];
    if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
        // Imágenes en Base64
        imagenes = producto.imagenes.map(img => img.datos || img);
    } else if (producto.foto && producto.foto !== '' && producto.foto !== 'undefined') {
        imagenes = [producto.foto];
    } else if (producto.imagen && producto.imagen !== '' && producto.imagen !== 'undefined') {
        imagenes = [producto.imagen];
    }
    
    // Imagen por defecto si no hay ninguna
    if (imagenes.length === 0) {
        imagenes = ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500"%3E%3Crect fill="%2328a745" width="500" height="500"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin Imagen%3C/text%3E%3C/svg%3E'];
    }
    
    console.log('🖼️ Total de imágenes:', imagenes.length);
    
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
    
    // HTML de las miniaturas de imágenes
    const thumbnailsHtml = imagenes.length > 1 ? `
        <div class="producto-thumbnails">
            ${imagenes.map((img, index) => `
                <img src="${img}" 
                     alt="Imagen ${index + 1}" 
                     class="thumbnail ${index === 0 ? 'active' : ''}"
                     onclick="cambiarImagenPrincipal('${img.replace(/'/g, "\\'")}', ${index})">
            `).join('')}
        </div>
    ` : '';
    
    // Determinar envío
    const envioHtml = esAuto 
        ? (producto.envioExterior 
            ? '<div class="producto-envio envio-gratis">✈️ ✅ Apto para envío al exterior</div>'
            : '<div class="producto-envio">✈️ No disponible para envío al exterior</div>')
        : (producto.envio 
            ? '<div class="producto-envio envio-gratis">🚚 ✅ Envío gratis disponible</div>'
            : '<div class="producto-envio">🚚 Envío no incluido</div>');
    
    // Renderizar campos específicos de AUTOS
    const camposAutoHtml = esAuto ? `
        ${producto.modeloAuto ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Modelo</div>
                <div class="producto-atributo-valor">${producto.modeloAuto}</div>
            </div>
        ` : ''}
        
        ${producto.estadoStock ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Estado</div>
                <div class="producto-atributo-valor">${producto.estadoStock}</div>
            </div>
        ` : ''}
        
        ${producto.kilometros ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Kilometraje</div>
                <div class="producto-atributo-valor">${Number(producto.kilometros).toLocaleString('es-AR')} km</div>
            </div>
        ` : ''}
        
        ${producto.color ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Color</div>
                <div class="producto-atributo-valor">${producto.color}</div>
            </div>
        ` : ''}
    ` : '';
    
    // Renderizar campos específicos de PRODUCTOS
    const camposProductoHtml = !esAuto ? `
        ${producto.subcategoria ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Tipo</div>
                <div class="producto-atributo-valor">${producto.subcategoria}</div>
            </div>
        ` : ''}
        
        ${producto.modelos && Array.isArray(producto.modelos) && producto.modelos.length > 0 ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Modelos Compatibles</div>
                <div class="producto-atributo-valor">${producto.modelos.join(', ')}</div>
            </div>
        ` : ''}
        
        ${producto.color ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Color</div>
                <div class="producto-atributo-valor">${producto.color}</div>
            </div>
        ` : ''}
        
        ${producto.tamano ? `
            <div class="producto-atributo">
                <div class="producto-atributo-label">Tamaño</div>
                <div class="producto-atributo-valor">${producto.tamano}</div>
            </div>
        ` : ''}
    ` : '';
    
    // Botón de acción según tipo
    const botonAccionHtml = esAuto ? `
        <button class="btn-contactar" onclick="contactarPorAuto()">
            📞 Quiero que me contacten
        </button>
    ` : `
        <button class="btn-comprar" onclick="comprarProducto()" ${producto.stock === 0 ? 'disabled' : ''}>
            🛒 ${producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
        <button class="btn-whatsapp" onclick="consultarPorWhatsApp()">
            💬 Consultar por WhatsApp
        </button>
    `;
    
    // Renderizar el HTML del producto
    wrapper.innerHTML = `
        <div class="producto-detalle-container">
            <div class="producto-detalle-content">
                <div class="producto-imagen-container">
                    <img src="${imagenes[0]}" 
                         alt="${producto.nombre}" 
                         class="producto-imagen-principal"
                         id="imagen-principal"
                         onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22%3E%3Crect fill=%22%2328a745%22 width=%22500%22 height=%22500%22/%3E%3Ctext fill=%22%23ffffff%22 font-family=%22Arial%22 font-size=%2224%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin Imagen%3C/text%3E%3C/svg%3E';">
                    ${thumbnailsHtml}
                </div>
                
                <div class="producto-info">
                    <h1 class="producto-titulo">${producto.nombre}</h1>
                    
                    <div class="producto-precio">
                        ${producto.moneda || '$'} ${Number(producto.precio).toLocaleString('es-AR')}
                    </div>
                    
                    ${!esAuto ? `<div class="producto-stock ${stockClass}">${stockTexto}</div>` : ''}
                    
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
                    
                    ${camposAutoHtml}
                    ${camposProductoHtml}
                    
                    ${envioHtml}
                    
                    <div class="producto-acciones">
                        ${botonAccionHtml}
                        <button onclick="window.location.href='index.html'" class="btn-volver">⬅️ Volver</button>
                    </div>
                </div>
            </div>
            
            ${(producto['descripcion-larga'] || producto.descripcion || producto['descripcion-corta']) ? `
                <div class="producto-descripcion">
                    <h2>📋 Descripción del producto</h2>
                    <p>${producto['descripcion-larga'] || producto.descripcion || producto['descripcion-corta']}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    // Guardar el producto en window para usarlo en comprarProducto()
    window.currentProducto = producto;
}

function cambiarImagenPrincipal(imagenUrl, index) {
    const imagenPrincipal = document.getElementById('imagen-principal');
    if (imagenPrincipal) {
        imagenPrincipal.src = imagenUrl;
    }
    
    // Actualizar clase active en thumbnails
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function contactarPorAuto() {
    if (!window.currentProducto) {
        alert('❌ Error: Producto no disponible');
        return;
    }
    
    const producto = window.currentProducto;
    
    // Crear mensaje detallado para WhatsApp
    let mensaje = `🚗 *CONSULTA POR AUTO*\n\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensaje += `📌 *${producto.nombre}*\n\n`;
    mensaje += `💰 Precio: *${producto.moneda || '$'} ${Number(producto.precio).toLocaleString('es-AR')}*\n`;
    
    if (producto.marca) mensaje += `🏭 Marca: ${producto.marca}\n`;
    if (producto.modeloAuto) mensaje += `🚙 Modelo: ${producto.modeloAuto}\n`;
    if (producto.estadoStock) mensaje += `📋 Estado: ${producto.estadoStock}\n`;
    if (producto.kilometros) mensaje += `🛣️ Kilometraje: ${Number(producto.kilometros).toLocaleString('es-AR')} km\n`;
    if (producto.color) mensaje += `🎨 Color: ${producto.color}\n`;
    if (producto.envioExterior) mensaje += `✈️ Envío al exterior: Sí\n`;
    
    mensaje += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensaje += `Hola! Estoy interesado en este auto. ¿Podrían darme más información?`;
    
    // Abrir WhatsApp con el mensaje
    if (window.API_CONFIG && window.API_CONFIG.getWhatsAppUrl) {
        const url = window.API_CONFIG.getWhatsAppUrl(mensaje);
        window.open(url, '_blank');
    } else {
        alert('⚠️ Error: Configuración de WhatsApp no disponible. Verifica config.js');
    }
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

function consultarPorWhatsApp() {
    if (!window.currentProducto) {
        alert('❌ Error: Producto no disponible');
        return;
    }
    
    const producto = window.currentProducto;
    
    // Crear mensaje para productos
    let mensaje = `🛍️ *CONSULTA POR PRODUCTO*\n\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensaje += `📌 *${producto.nombre}*\n\n`;
    mensaje += `💰 Precio: *${producto.moneda || '$'} ${Number(producto.precio).toLocaleString('es-AR')}*\n`;
    
    if (producto.marca) mensaje += `🏭 Marca: ${producto.marca}\n`;
    if (producto.subcategoria) mensaje += `📦 Tipo: ${producto.subcategoria}\n`;
    if (producto.stock !== undefined) mensaje += `📊 Stock disponible: ${producto.stock} unidades\n`;
    if (producto.modelos && Array.isArray(producto.modelos) && producto.modelos.length > 0) {
        mensaje += `🚗 Compatible con: ${producto.modelos.join(', ')}\n`;
    }
    if (producto.color) mensaje += `🎨 Color: ${producto.color}\n`;
    if (producto.tamano) mensaje += `📏 Tamaño: ${producto.tamano}\n`;
    if (producto.envio) mensaje += `🚚 Envío gratis: Sí\n`;
    
    mensaje += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensaje += `Hola! Me interesa este producto. ¿Podrían darme más información?`;
    
    // Abrir WhatsApp
    if (window.API_CONFIG && window.API_CONFIG.getWhatsAppUrl) {
        const url = window.API_CONFIG.getWhatsAppUrl(mensaje);
        window.open(url, '_blank');
    } else {
        alert('⚠️ Error: Configuración de WhatsApp no disponible. Verifica config.js');
    }
}

// Auto-inicializar
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initProductoDetalle, 100);
} else {
    document.addEventListener('DOMContentLoaded', initProductoDetalle);
}
