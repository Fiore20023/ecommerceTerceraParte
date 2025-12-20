// Búsqueda global que redirige a index.html con resultados
console.log('🔍 busqueda-global.js cargado');

document.addEventListener('DOMContentLoaded', () => {
    const formBusqueda = document.getElementById('form-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');
    
    if (formBusqueda && inputBusqueda) {
        formBusqueda.addEventListener('submit', (e) => {
            e.preventDefault();
            const termino = inputBusqueda.value.trim();
            
            if (termino) {
                // Redirigir a index.html con el término de búsqueda
                window.location.href = `index.html?busqueda=${encodeURIComponent(termino)}`;
            }
        });
    }
});
