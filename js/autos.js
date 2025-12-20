// JavaScript para la página de Autos

// Función para ver autos por modelo
function verAutosPorModelo(modelo) {
    // Redirigir a index.html con el parámetro modelo (filtra autos en venta)
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
