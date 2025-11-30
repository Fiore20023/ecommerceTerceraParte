// ------------------------------------------------
//             variables globales
// ------------------------------------------------

// ------------------------------------------------
//             funciones globales
// ------------------------------------------------

// Función para enviar el carrito al backend
async function enviarCarritoAlBackend() {
    const items = Object.values(window.cart || {});
    
    if (!items.length) {
        alert('⚠️ El carrito está vacío');
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
            alert(`✅ Pedido enviado exitosamente!\nTotal de productos: ${items.length}\nTotal: $${result.data.total || 0}`);
            
            // Vaciar el carrito después de enviar
            window.cart = {};
            localStorage.removeItem('cart');
            
            // Re-renderizar el carrito vacío
            initCarrito();
        } else {
            console.error('❌ Error del servidor:', result);
            alert('❌ Error al procesar el pedido: ' + (result.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('❌ Error de conexión con el servidor');
    }
}


function initCarrito(){
    const container = document.getElementById('carrito-productos-container');
    const tablaBody = document.querySelector('#tabla-productos tbody');
    
    // Render using window.cart if available
    function renderProductosCarrito(){
        if (!container) return;
        const items = Object.values(window.cart || {});
        
        if (!items.length) { 
            container.innerHTML = '<h2>No hay productos en el carrito</h2>'; 
            return; 
        }
        
        container.innerHTML = '';
        items.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${producto.foto}" alt="${producto.nombre}">
                <div class="card-body">
                    <h3 class="card-title">${producto.nombre}</h3>
                    <p class="card-price">$${producto.precio}</p>
                    <p class="card-description">${producto['descripcion-corta'] || producto.detalles}</p>
                    <p>Cantidad: ${producto.qty}</p>
                </div>
            `;
            container.appendChild(card);
        });

        if (tablaBody) {
            tablaBody.innerHTML = items.map(p => `
                <tr>
                    <td>${p.nombre}</td>
                    <td>$${p.precio}</td>
                    <td>${p.qty}</td>
                    <td>${p.marca||''}</td>
                    <td>${p.categoria||''}</td>
                    <td>${p['descripcion-corta'] || p.detalles||''}</td>
                    <td>${p.envio ? 'Sí' : 'No'}</td>
                    <td><img src="${p.foto}" alt="${p.nombre}" style="width:40px;height:40px;object-fit:cover;"></td>
                </tr>
            `).join('');
        }
        
        // render summary total for view
        const summaryEl = document.getElementById('carrito-total-view');
        if (summaryEl){
            const total = items.reduce((s,it)=> s + (it.precio * it.qty), 0);
            summaryEl.innerHTML = `
                <h3>Total: $${total.toFixed(2)}</h3>
                <button id="btn-finalizar-compra" class="btn-finalizar">Finalizar Compra</button>
            `;
            
            // Agregar evento al botón de finalizar compra
            const btnFinalizar = document.getElementById('btn-finalizar-compra');
            if (btnFinalizar) {
                btnFinalizar.addEventListener('click', enviarCarritoAlBackend);
            }
        }
    }

    renderProductosCarrito();
}

// auto-run if loaded standalone
if (document.readyState === 'complete' || document.readyState === 'interactive') initCarrito();
