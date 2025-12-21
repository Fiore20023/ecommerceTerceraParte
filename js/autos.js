// JavaScript para la página de Autos

// Función para ver autos por modelo
function verAutosPorModelo(modelo) {
    console.log('=== INICIO verAutosPorModelo ===');
    console.log('Modelo seleccionado:', modelo);
    
    // Mostrar loading spinner
    document.getElementById('loading-spinner').style.display = 'block';
    document.querySelector('.search-section').style.display = 'none';
    
    // Obtener productos del backend o localStorage
    cargarYMostrarAutos(modelo);
}

function volverAModelos() {
    document.querySelector('.search-section').style.display = 'block';
    document.getElementById('resultados-autos').style.display = 'none';
    document.getElementById('loading-spinner').style.display = 'none';
}

async function cargarYMostrarAutos(modelo) {
    console.log('=== INICIO cargarYMostrarAutos ===');
    console.log('Modelo recibido:', modelo);
    
    try {
        console.log('Fetching API...');
        // Intentar cargar desde el backend
        const response = await fetch('https://planeta-citroen-api-8e0a0fc0bda1.herokuapp.com/api/productos');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        const data = await response.json();
        
        console.log('Respuesta completa de la API:', data);
        console.log('Tipo de data:', typeof data);
        console.log('Es array?:', Array.isArray(data));
        
        // La API puede devolver un objeto con una propiedad 'productos' o directamente un array
        const productos = Array.isArray(data) ? data : (data.productos || data.data || []);
        console.log('Productos extraídos:', productos);
        console.log('Cantidad de productos:', productos.length);
        
        // Ver estructura del primer producto
        if (productos.length > 0) {
            console.log('EJEMPLO - Primer producto:', productos[0]);
            console.log('Campos disponibles:', Object.keys(productos[0]));
        }
        
        // Filtrar solo autos del modelo seleccionado
        const autos = productos.filter(p => {
            console.log(`Producto: ${p.nombre}, tipoProducto: "${p.tipoProducto}", modelos:`, p.modelos);
            
            // Verificar si es un auto (tipoProducto === 'auto')
            const esAuto = p.tipoProducto === 'auto';
            
            // Verificar si el modelo coincide (modelos puede ser array o string)
            let tieneModelo = false;
            if (p.modelos) {
                if (Array.isArray(p.modelos)) {
                    // Si es array, buscar si alguno coincide
                    tieneModelo = p.modelos.some(m => m.toLowerCase() === modelo.toLowerCase());
                } else {
                    // Si es string, comparar directamente
                    tieneModelo = p.modelos.toLowerCase() === modelo.toLowerCase();
                }
            }
            
            return esAuto && tieneModelo;
        });
        
        console.log('Autos filtrados:', autos);
        console.log('Cantidad de autos filtrados:', autos.length);
        
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
    const loadingSpinner = document.getElementById('loading-spinner');
    const gridAutos = document.getElementById('grid-autos');
    const tituloResultados = document.getElementById('titulo-resultados');
    
    // Ocultar loading
    loadingSpinner.style.display = 'none';
    
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
