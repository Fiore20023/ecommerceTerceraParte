// JavaScript para la página de Repuestos

// Función para cambiar entre tabs
function switchTab(tabName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(section => section.classList.remove('active'));
    
    // Desactivar todos los botones
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Activar la sección y botón correspondiente
    if (tabName === 'modelos') {
        document.getElementById('modelos-section').classList.add('active');
        document.querySelectorAll('.tab-button')[0].classList.add('active');
    } else if (tabName === 'categorias') {
        document.getElementById('categorias-section').classList.add('active');
        document.querySelectorAll('.tab-button')[1].classList.add('active');
    }
}

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

// Función para filtrar por modelo desde el menú de Autos (busca vehículos en venta)
function filtrarPorModelo(modelo) {
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
