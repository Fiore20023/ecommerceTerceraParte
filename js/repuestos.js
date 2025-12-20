// JavaScript para la página de Repuestos

// Función para buscar por modelo compatible
function buscarPorModelo(modelo) {
    // Redirigir a index.html con el parámetro modeloRepuesto
    window.location.href = `index.html?modeloRepuesto=${encodeURIComponent(modelo)}`;
}

// Función para buscar por categoría
function buscarPorCategoria(categoria) {
    // Redirigir a index.html con el parámetro categoria
    window.location.href = `index.html?categoria=${encodeURIComponent(categoria)}`;
}

// Función para filtrar por modelo desde el menú
function filtrarPorModelo(modelo) {
    // Esta función se usa desde el menú de Autos (busca vehículos en venta)
    window.location.href = `index.html?modelo=${encodeURIComponent(modelo)}`;
}

// Actualizar contador del carrito
document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
});

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}
