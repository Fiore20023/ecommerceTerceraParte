// JavaScript para la página de Repuestos

// Variables para almacenar selecciones de filtros
let filtroSecundarioModelo = '';
let filtroSecundarioCategoria = '';

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

// Función para aplicar filtro secundario
function aplicarFiltroSecundario(tipoPrincipal) {
    if (tipoPrincipal === 'modelo') {
        // Guardar el filtro de categoría seleccionado
        filtroSecundarioCategoria = document.getElementById('filtro-categoria-modelo').value;
    } else if (tipoPrincipal === 'categoria') {
        // Guardar el filtro de modelo seleccionado
        filtroSecundarioModelo = document.getElementById('filtro-modelo-categoria').value;
    }
}

// Función para buscar por modelo compatible (con filtro opcional de categoría)
function buscarPorModelo(modelo) {
    let url = `index.html?modeloRepuesto=${encodeURIComponent(modelo)}`;
    
    // Si hay un filtro de categoría seleccionado, agregarlo a la URL
    if (filtroSecundarioCategoria) {
        url += `&categoria=${encodeURIComponent(filtroSecundarioCategoria)}`;
    }
    
    window.location.href = url;
}

// Función para buscar por categoría (con filtro opcional de modelo)
function buscarPorCategoria(categoria) {
    let url = `index.html?categoria=${encodeURIComponent(categoria)}`;
    
    // Si hay un filtro de modelo seleccionado, agregarlo a la URL
    if (filtroSecundarioModelo) {
        url += `&modeloRepuesto=${encodeURIComponent(filtroSecundarioModelo)}`;
    }
    
    window.location.href = url;
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
