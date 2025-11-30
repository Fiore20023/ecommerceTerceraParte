// Configuración de la API del Backend
// Cambiar según el entorno (desarrollo / producción)

const API_CONFIG = {
    // URL base del backend (desarrollo local)
    BASE_URL: 'http://localhost:3001/api',
    
    // Endpoints
    ENDPOINTS: {
        PRODUCTOS: '/productos',
        CARRITO: '/carrito'
    },
    
    // Métodos helper
    getProductosUrl: function() {
        return this.BASE_URL + this.ENDPOINTS.PRODUCTOS;
    },
    
    getProductoByIdUrl: function(id) {
        return this.BASE_URL + this.ENDPOINTS.PRODUCTOS + '/' + id;
    },
    
    getCarritoUrl: function() {
        return this.BASE_URL + this.ENDPOINTS.CARRITO;
    }
};

// Hacer disponible globalmente
window.API_CONFIG = API_CONFIG;

console.log('✅ Configuración API cargada:', API_CONFIG.BASE_URL);
