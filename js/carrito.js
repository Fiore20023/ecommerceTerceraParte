// ------------------------------------------------
//             variables globales
// ------------------------------------------------
let pedidoFinalizado = false;

// Formatea montos con separador de miles y decimales opcionales
function formatMoney(value, fractionDigits = 0){
    const num = Number(value) || 0;
    return num.toLocaleString('es-AR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
}

// Cargar carrito desde localStorage al inicio
if (!window.cart) {
    window.cart = {};
}
try {
    const stored = localStorage.getItem('cart');
    if (stored) {
        window.cart = JSON.parse(stored);
        console.log('🛒 Carrito cargado desde localStorage:', window.cart);
    }
} catch (e) {
    console.error('Error al cargar carrito:', e);
}

// ------------------------------------------------
//             funciones globales
// ------------------------------------------------

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(window.cart || {}));
    console.log('💾 Carrito guardado:', window.cart);
}

// Función para cambiar cantidad de un producto
function cambiarCantidad(productId) {
    const producto = window.cart[productId];
    const stockDisponible = producto.stock || 999;
    
    const mensaje = `Producto: ${producto.nombre}\nCantidad actual: ${producto.qty}\nStock disponible: ${stockDisponible}\n\nIngresa la nueva cantidad:`;
    const nuevaCantidad = prompt(mensaje, producto.qty);
    
    if (nuevaCantidad === null) return; // Cancelado
    
    const cantidadNum = parseInt(nuevaCantidad);
    
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
        alert('⚠️ Cantidad inválida');
        return;
    }
    
    if (cantidadNum > stockDisponible) {
        alert(`⚠️ Stock insuficiente!\nSolo hay ${stockDisponible} unidades disponibles.`);
        return;
    }
    
    window.cart[productId].qty = cantidadNum;
    saveCart();
    renderCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(productId) {
    if (confirm(`¿Eliminar ${window.cart[productId].nombre} del carrito?`)) {
        delete window.cart[productId];
        saveCart();
        renderCarrito();
    }
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    if (confirm('¿Vaciar todo el carrito?')) {
        window.cart = {};
        saveCart();
        pedidoFinalizado = false;
        renderCarrito();
    }
}

// Función para enviar el carrito al backend
async function enviarCarritoAlBackend() {
    const items = Object.values(window.cart || {});
    
    if (!items.length) {
        alert('⚠️ El carrito está vacío');
        return;
    }
    
    // Validar stock antes de enviar
    const itemsSinStock = [];
    items.forEach(item => {
        const stockDisponible = item.stock || 999;
        if (item.qty > stockDisponible) {
            itemsSinStock.push(`${item.nombre}: solicitaste ${item.qty} pero solo hay ${stockDisponible}`);
        }
    });
    
    if (itemsSinStock.length > 0) {
        alert('⚠️ Stock insuficiente en los siguientes productos:\n\n' + itemsSinStock.join('\n'));
        return;
    }

    if (!window.API_CONFIG) {
        alert('⚠️ Backend no configurado');
        return;
    }

    try {
        console.log('📤 Enviando carrito al backend...', items);
        
        const response = await fetch(window.API_CONFIG.getCarritoUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Carrito enviado exitosamente:', result);
            pedidoFinalizado = true;
            
            const mensajeEl = document.getElementById('carrito-mensaje');
            if (mensajeEl) {
                mensajeEl.innerHTML = `
                    <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>✅ Pedido registrado exitosamente!</strong><br>
                        Total de productos: ${items.length}<br>
                        Total: $${result.data.total || 0}<br>
                        <em>Ahora puedes proceder al pago.</em>
                    </div>
                `;
            }
            
            renderCarrito();
        } else {
            console.error('❌ Error del servidor:', result);
            alert('❌ Error al procesar el pedido: ' + (result.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('❌ Error de conexión con el servidor');
    }
}

// Función para crear preferencia de pago con Mercado Pago
async function pagarConMercadoPago() {
    const items = Object.values(window.cart || {});
    
    if (!items.length) {
        alert('⚠️ El carrito está vacío');
        return;
    }

    try {
        console.log('💳 Creando preferencia de pago...');
        
        // BASE_URL ya incluye /api, solo agregamos /mercadopago/create-preference
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/mercadopago/create-preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Preferencia creada:', result.data);
            
            if (!result.data || !result.data.init_point) {
                console.error('❌ No se recibió init_point:', result);
                alert('❌ Error: No se pudo generar el link de pago de Mercado Pago');
                return;
            }
            
            // Vaciar el carrito antes de redirigir
            window.cart = {};
            saveCart();
            
            // Redirigir a Mercado Pago
            console.log('🔗 Redirigiendo a:', result.data.init_point);
            window.location.href = result.data.init_point;
        } else {
            console.error('❌ Error al crear preferencia:', result);
            alert('❌ Error al procesar el pago: ' + (result.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('❌ Error de conexión con el servidor');
    }
}

// Función principal para renderizar el carrito
function renderCarrito() {
    const tablaBody = document.querySelector('#tabla-carrito tbody');
    const summaryEl = document.getElementById('carrito-total-view');
    
    if (!tablaBody) return;
    
    const items = Object.values(window.cart || {});
    
    // Si el carrito está vacío
    if (!items.length) {
        tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px;"><h2>No hay productos en el carrito</h2></td></tr>';
        if (summaryEl) summaryEl.innerHTML = '';
        return;
    }
    
    // Renderizar tabla de productos
    tablaBody.innerHTML = items.map(p => {
        const subtotal = p.precio * p.qty;
        const foto = p.imagenCart
            || (p.imagenes && Array.isArray(p.imagenes) && p.imagenes.length > 0 && (p.imagenes[0]?.datos || p.imagenes[0]))
            || p.foto
            || p.imagen
            || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%2328a745" width="60" height="60"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E%3F%3C/text%3E%3C/svg%3E';
        
        const stockDisponible = p.stock || 999;
        const stockWarning = p.qty > stockDisponible ? ' style="background:#f8d7da; color:#721c24;"' : '';
        const stockBadge = p.qty > stockDisponible 
            ? `<span style="color:#dc3545; font-size:0.8rem; display:block;">⚠️ Stock: ${stockDisponible}</span>`
            : `<span style="color:#666; font-size:0.8rem; display:block;">Stock: ${stockDisponible}</span>`;
        
        return `
            <tr${stockWarning}>
                <td><img src="${foto}" alt="${p.nombre}" style="width:60px;height:60px;object-fit:cover;border-radius:5px;"></td>
                <td>${p.nombre}${stockBadge}</td>
                <td>$${formatMoney(p.precio)}</td>
                <td>
                    <button onclick="cambiarCantidad('${p.id}')" style="background:#ffc107;color:#000;border:none;padding:5px 10px;margin-right:5px;cursor:pointer;border-radius:3px;">✏️ ${p.qty}</button>
                </td>
                <td>$${formatMoney(subtotal, 2)}</td>
                <td>
                    <button onclick="eliminarDelCarrito('${p.id}')" style="background:#dc3545;color:#fff;border:none;padding:5px 10px;cursor:pointer;border-radius:3px;">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Calcular total
    const total = items.reduce((s, it) => s + (it.precio * it.qty), 0);
    
    // Renderizar resumen y botones
    if (summaryEl) {
        let html = `<h2 style="margin: 20px 0;">Total: $${formatMoney(total, 2)}</h2>`;
        
        if (!pedidoFinalizado) {
            // Antes de finalizar: mostrar botón de finalizar compra y vaciar carrito
            html += `
                <div style="margin: 20px 0;">
                    <button id="btn-finalizar-compra" class="btn-finalizar" onclick="enviarCarritoAlBackend()" style="background:#28a745;color:#fff;border:none;padding:12px 24px;margin:10px 5px;cursor:pointer;border-radius:5px;font-size:16px;font-weight:bold;">✅ Finalizar Compra</button>
                    <button onclick="vaciarCarrito()" style="background:#6c757d;color:#fff;border:none;padding:12px 24px;margin:10px 5px;cursor:pointer;border-radius:5px;font-size:16px;">🗑️ Vaciar Carrito</button>
                </div>
            `;
        } else {
            // Después de finalizar: mostrar botón de Mercado Pago y vaciar carrito
            html += `
                <div style="margin: 20px 0;">
                    <button onclick="pagarConMercadoPago()" style="background:#009ee3;color:#fff;border:none;padding:12px 24px;margin:10px 5px;cursor:pointer;border-radius:5px;font-size:16px;font-weight:bold;">💳 Pagar con Mercado Pago</button>
                    <button onclick="vaciarCarrito()" style="background:#6c757d;color:#fff;border:none;padding:12px 24px;margin:10px 5px;cursor:pointer;border-radius:5px;font-size:16px;">🗑️ Vaciar Carrito</button>
                </div>
            `;
        }
        
        summaryEl.innerHTML = html;
    }
}

// Inicializar carrito al cargar la página
function initCarrito() {
    renderCarrito();
}

// auto-run if loaded standalone
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initCarrito();
} else {
    document.addEventListener('DOMContentLoaded', initCarrito);
}
