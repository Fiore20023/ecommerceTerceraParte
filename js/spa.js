// SPA router and cart modal utility
console.log('spa.js cargado');

// Simple router: intercept link clicks and load views into #app
function spaNavigate(url, push = true) {
    // If linking to same origin files, fetch and replace main content
    fetch(url)
        .then(res => res.text())
        .then(html => {
            // Parse returned HTML and extract the main innerHTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const main = doc.querySelector('main');
            if (main) {
                document.getElementById('app').innerHTML = main.innerHTML;
                // update title from fetched doc
                if (doc.title) document.title = doc.title;
                if (push) history.pushState({path: url}, '', url);
                // init view script if present
                runViewInitForPath(url);
            }
        })
        .catch(err => console.error('Error cargando vista:', err));
}

function runViewInitForPath(path) {
    const p = path.split('/').pop();
    if (p === '' || p === 'index.html') {
        if (typeof initInicio === 'function') initInicio();
    } else if (p === 'alta.html') {
        if (typeof initAlta === 'function') initAlta();
    } else if (p === 'carrito.html') {
        if (typeof initCarrito === 'function') initCarrito();
    } else if (p === 'contacto.html') {
        if (typeof initContacto === 'function') initContacto();
    }
}

// Intercept clicks on internal links
document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    // if the click is inside the cart toggle, let cart handlers run (do not navigate)
    if (e.target.closest('#boton-carrito') || e.target.closest('[data-cart-toggle]')) return;
    const href = a.getAttribute('href');
    if (!href) return;
    // Only handle local html links
    if (href.endsWith('.html') || href === './' || href === '/') {
        e.preventDefault();
        spaNavigate(href);
    }
});

// Handle back/forward
window.addEventListener('popstate', (e) => {
    const path = document.location.pathname.split('/').pop() || 'index.html';
    spaNavigate(path, false);
});

// Basic cart modal implementation
(function(){
    const body = document.body;
    
    // Create cart modal
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'cart-modal hidden';
    modal.innerHTML = `
        <div class="cart-modal-backdrop"></div>
        <div class="cart-modal-content">
            <button class="cart-close">×</button>
            <h2>🛒 Carrito de Compras</h2>
            <div id="cart-items"></div>
            <div id="cart-summary"></div>
            <div id="cart-actions">
                <button id="cart-continue" style="background:#6c757d;">Seguir Comprando</button>
                <button id="cart-empty">Vaciar carrito</button>
                <button id="cart-checkout">Finalizar Compra</button>
            </div>
        </div>
    `;
    body.appendChild(modal);

    // Create quantity selector modal
    const qtyModal = document.createElement('div');
    qtyModal.id = 'qty-modal';
    qtyModal.className = 'qty-modal hidden';
    qtyModal.innerHTML = `
        <div class="qty-modal-backdrop"></div>
        <div class="qty-modal-content">
            <h3 id="qty-product-name">Producto</h3>
            <img id="qty-product-img" src="" alt="" style="display:none;">
            <p id="qty-product-price"></p>
            <div class="qty-selector">
                <button id="qty-decrease">-</button>
                <input type="number" id="qty-input" value="1" min="1" max="99">
                <button id="qty-increase">+</button>
            </div>
            <div class="qty-modal-actions">
                <button class="qty-modal-cancel">Cancelar</button>
                <button class="qty-modal-confirm">Agregar al Carrito</button>
            </div>
        </div>
    `;
    body.appendChild(qtyModal);

    let selectedProduct = null;

    function openCart() {
        modal.classList.remove('hidden');
        renderCart();
    }
    
    function closeCart() {
        modal.classList.add('hidden');
    }

    function openQtyModal(product) {
        selectedProduct = product;
        const qtyInput = document.getElementById('qty-input');
        const productName = document.getElementById('qty-product-name');
        const productPrice = document.getElementById('qty-product-price');
        const productImg = document.getElementById('qty-product-img');
        
        qtyInput.value = 1;
        productName.textContent = product.nombre || product.name || 'Producto';
        productPrice.textContent = `Precio: $${product.precio || 0}`;
        
        const imagenUrl = product.foto || product.imagen;
        if (imagenUrl && imagenUrl !== '' && imagenUrl !== 'undefined') {
            productImg.src = imagenUrl;
            productImg.style.display = 'block';
            productImg.onerror = function() {
                this.style.display = 'none';
            };
        } else {
            productImg.style.display = 'none';
        }
        
        qtyModal.classList.remove('hidden');
    }
    
    function closeQtyModal() {
        qtyModal.classList.add('hidden');
        selectedProduct = null;
    }

    // Toggle from header button
    document.addEventListener('click', (e) => {
        if (e.target.closest('#boton-carrito') || e.target.closest('[data-cart-toggle]')) {
            e.preventDefault();
            if (modal.classList.contains('hidden')) openCart(); else closeCart();
        }
    });

    // Close cart modal on backdrop or close button
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-modal-backdrop') || e.target.classList.contains('cart-close')) {
            closeCart();
        }
        // Botón "Seguir Comprando"
        if (e.target.id === 'cart-continue') {
            closeCart();
        }
    });

    // Qty modal controls
    qtyModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-modal-backdrop') || e.target.classList.contains('qty-modal-cancel')) {
            closeQtyModal();
        }
    });

    document.getElementById('qty-decrease').addEventListener('click', () => {
        const input = document.getElementById('qty-input');
        if (input.valueAsNumber > 1) input.value = input.valueAsNumber - 1;
    });

    document.getElementById('qty-increase').addEventListener('click', () => {
        const input = document.getElementById('qty-input');
        if (input.valueAsNumber < 99) input.value = input.valueAsNumber + 1;
    });

    document.querySelector('.qty-modal-confirm').addEventListener('click', () => {
        if (selectedProduct) {
            const qty = document.getElementById('qty-input').valueAsNumber || 1;
            addToCartWithQty(selectedProduct, qty);
            closeQtyModal();
        }
    });

    // Close on Esc
    document.addEventListener('keydown', (e)=>{ 
        if (e.key === 'Escape') {
            closeCart();
            closeQtyModal();
        }
    });

    // Simple cart state in localStorage
    window.cart = JSON.parse(localStorage.getItem('cart')||'{}');

    function saveCart(){ localStorage.setItem('cart', JSON.stringify(window.cart)); }

    function addToCartWithQty(product, qty){
        console.log('🛒 addToCartWithQty llamada:', product, 'cantidad:', qty);
        const key = product._id || product.id || product.nombre;
        const precioNum = Number(product.precio) || 0;
        
        console.log('🔑 Key del producto:', key);
        console.log('📦 Carrito antes:', JSON.stringify(window.cart));
        
        if (!window.cart[key]) {
            window.cart[key] = {...product, qty: 0, precio: precioNum};
        }
        window.cart[key].qty += qty;
        
        console.log('📦 Carrito después:', JSON.stringify(window.cart));
        console.log('💾 Guardando en localStorage...');
        
        saveCart();
        renderCart();
        showToast(`✅ ${qty}x ${product.nombre} agregado al carrito`);
        openCart();
        
        console.log('✅ Producto agregado exitosamente. localStorage:', localStorage.getItem('cart'));
    }

    // Exponer funciones globalmente ANTES de usarlas
    window.openCart = openCart;
    window.closeCart = closeCart;
    window.openQtyModal = openQtyModal;
    window.closeQtyModal = closeQtyModal;
    
    window.addToCart = function(product){
        // Open quantity modal instead of directly adding
        console.log('✅ addToCart llamada con:', product);
        if (!product) {
            console.error('❌ Producto es null o undefined');
            return;
        }
        openQtyModal(product);
    }
    
    console.log('🎯 Funciones del carrito definidas:', {
        addToCart: typeof window.addToCart,
        openCart: typeof window.openCart,
        openQtyModal: typeof window.openQtyModal
    });

    // update cart by key (id or name key used internally)
    window.updateCartQty = function(key, qty){
        if (!window.cart[key]) return;
        window.cart[key].qty = qty;
        if (window.cart[key].qty <= 0) delete window.cart[key];
        saveCart();
        renderCart();
    }

    window.removeCartItem = function(key){
        delete window.cart[key];
        saveCart();
        renderCart();
    }

    function renderCart(){
        const container = document.getElementById('cart-items');
        if (!container) return;
        const items = Object.values(window.cart);
        if (!items.length) { 
            container.innerHTML = '<p style="text-align:center; padding:2rem; color:#999;">El carrito está vacío</p>';
            document.getElementById('cart-summary').innerHTML = '';
            return; 
        }
        
        // render using entries so we keep the internal key
        container.innerHTML = Object.entries(window.cart).map(([key,it]) => {
            const imagenUrl = it.foto || it.imagen || 'https://via.placeholder.com/80?text=No';
            return `
            <div class="cart-item">
                <img src="${imagenUrl}" alt="${it.nombre}" width="80" height="80" onerror="this.onerror=null; this.src='https://via.placeholder.com/80?text=No';">
                <div class="cart-item-info">
                    <strong>${it.nombre}</strong>
                    <div style="margin-top:0.5rem; color:#666;">
                        $${Number(it.precio) || 0} × 
                        <input type="number" min="1" max="99" value="${it.qty}" data-key="${key}" class="cart-qty"> unidades
                    </div>
                    <div style="margin-top:0.3rem; font-weight:bold; color:#333;">
                        Subtotal: $${((Number(it.precio) || 0) * it.qty).toFixed(2)}
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-decr" data-key="${key}" title="Disminuir">-</button>
                    <button class="cart-incr" data-key="${key}" title="Aumentar">+</button>
                    <button class="cart-remove" data-key="${key}" title="Eliminar">🗑️ Eliminar</button>
                </div>
            </div>
        `;}).join('');
        
        // summary
        const summary = document.getElementById('cart-summary');
        if (summary){
            const total = items.reduce((s,it)=> s + ((Number(it.precio) || 0) * it.qty), 0);
            const totalItems = items.reduce((s,it)=> s + it.qty, 0);
            summary.innerHTML = `
                <p><strong>Total de productos:</strong> ${totalItems}</p>
                <p style="font-size:1.5rem; color:#333;"><strong>Total a pagar: $${total.toFixed(2)}</strong></p>
            `;
        }
        
        // bind qty inputs and remove
        container.querySelectorAll('.cart-qty').forEach(input => {
            input.addEventListener('change', (ev)=>{
                const n = ev.target.valueAsNumber || 1;
                updateCartQty(ev.target.dataset.key, n);
            });
        });
        container.querySelectorAll('.cart-remove').forEach(btn => {
            btn.addEventListener('click', ()=> removeCartItem(btn.dataset.key));
        });
        container.querySelectorAll('.cart-incr').forEach(btn => {
            btn.addEventListener('click', ()=>{
                const k = btn.dataset.key; 
                const cur = window.cart[k] ? window.cart[k].qty : 0; 
                updateCartQty(k, cur + 1);
            });
        });
        container.querySelectorAll('.cart-decr').forEach(btn => {
            btn.addEventListener('click', ()=>{
                const k = btn.dataset.key; 
                const cur = window.cart[k] ? window.cart[k].qty : 0; 
                updateCartQty(k, Math.max(0, cur - 1));
            });
        });
    }

    // Checkout: POST cart to backend
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'cart-checkout'){
            const items = Object.values(window.cart);
            
            if (!items.length) {
                showToast('⚠️ El carrito está vacío');
                return;
            }

            if (!window.API_CONFIG) {
                showToast('⚠️ Backend no configurado');
                return;
            }

            try {
                console.log('📤 Enviando carrito al backend...', items);
                
                const response = await fetch(window.API_CONFIG.getCarritoUrl(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(items)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    console.log('✅ Carrito enviado exitosamente:', result);
                    showToast(`✅ Pedido enviado! Total: $${result.data.total || 0}`);
                    
                    // Vaciar el carrito
                    window.cart = {};
                    saveCart();
                    renderCart();
                    
                    // Cerrar modal después de 2 segundos
                    setTimeout(closeCart, 2000);
                } else {
                    console.error('❌ Error del servidor:', result);
                    showToast('❌ Error: ' + (result.message || 'No se pudo procesar'));
                }
            } catch (error) {
                console.error('❌ Error de conexión:', error);
                showToast('❌ Error de conexión con el servidor');
            }
        }
        
        if (e.target && e.target.id === 'cart-empty'){
            if (confirm('¿Seguro que deseas vaciar el carrito?')) {
                window.cart = {}; 
                saveCart(); 
                renderCart(); 
                showToast('🗑️ Carrito vaciado');
            }
        }
    });

    // basic toast
    function showToast(msg){
        let t = document.getElementById('spa-toast');
        if (!t){ 
            t = document.createElement('div'); 
            t.id='spa-toast'; 
            t.className='spa-toast'; 
            document.body.appendChild(t); 
        }
        t.innerText = msg; 
        t.classList.add('show'); 
        setTimeout(()=> t.classList.remove('show'), 3000);
    }
    
    // expose functions globally
    window.showToast = showToast;
    window.openCart = openCart;
})();
