// JavaScript para la página de Autos

// Función para ver autos por modelo
function verAutosPorModelo(modelo) {
    alert('Clickeaste en: ' + modelo);
    console.log('Clic en modelo:', modelo);
    // Obtener productos del backend o localStorage
    cargarYMostrarAutos(modelo);
}

function volverAModelos() {
    document.querySelector('.search-section').style.display = 'block';
    document.getElementById('resultados-autos').style.display = 'none';
}

async function cargarYMostrarAutos(modelo) {
    console.log('Cargando autos para modelo:', modelo);
    try {
        // Intentar cargar desde el backend
        const response = await fetch('https://planeta-citroen-api-8e0a0fc0bda1.herokuapp.com/api/productos');
        const productos = await response.json();
        
        console.log('Productos cargados:', productos.length);
        
        // Filtrar solo autos del modelo seleccionado
        const autos = productos.filter(p => 
            p.tipo === 'auto' && 
            p.modelo && 
            p.modelo.toLowerCase() === modelo.toLowerCase()
        );
        
        console.log('Autos filtrados:', autos.length);
        
        mostrarAutos(autos, modelo);
    } catch (error) {
        console.error('Error cargando autos:', error);
        // Mostrar mensaje de error
        document.getElementById('grid-autos').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="color: #dc3545;">No se pudieron cargar los autos. Por favor, intenta más tarde.</p>
            </div>
        `;
    }
}

function mostrarAutos(autos, modelo) {
    const seccionModelos = document.querySelector('.search-section');
    const seccionResultados = document.getElementById('resultados-autos');
    const gridAutos = document.getElementById('grid-autos');
    const tituloResultados = document.getElementById('titulo-resultados');
    
    // Ocultar grid de modelos y mostrar resultados
    seccionModelos.style.display = 'none';
    seccionResultados.style.display = 'block';
    
    // Actualizar título
    tituloResultados.textContent = `${modelo} - ${autos.length} auto${autos.length !== 1 ? 's' : ''} disponible${autos.length !== 1 ? 's' : ''}`;
    
    if (autos.length === 0) {
        gridAutos.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: #666;">No hay autos ${modelo} disponibles en este momento</h3>
                <p style="color: #999; margin-top: 1rem;">Consultanos por WhatsApp para conocer disponibilidad</p>
                <a href="https://wa.me/5491165677391" class="btn-action btn-success" style="margin-top: 1.5rem; display: inline-block;">
                    💬 Consultar por WhatsApp
                </a>
            </div>
        `;
        return;
    }
    
    // Renderizar autos
    gridAutos.innerHTML = autos.map(auto => `
        <div class="auto-card">
            <div class="auto-image">
                <img src="${auto.imagen || 'images/auto-default.jpg'}" alt="${auto.nombre}" onerror="this.src='images/auto-default.jpg'">
            </div>
            <div class="auto-info">
                <h3>${auto.nombre}</h3>
                <p class="auto-modelo">${auto.modelo}</p>
                ${auto.año ? `<p class="auto-año">Año: ${auto.año}</p>` : ''}
                ${auto.descripcion ? `<p class="auto-descripcion">${auto.descripcion}</p>` : ''}
                <p class="auto-precio">$ ${parseFloat(auto.precio).toLocaleString('es-AR')}</p>
                <div class="auto-actions">
                    <a href="https://wa.me/5491165677391?text=Hola! Me interesa el ${auto.nombre}" 
                       class="btn-action btn-success" target="_blank">
                        💬 Consultar
                    </a>
                </div>
            </div>
        </div>
    `).join('');
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
