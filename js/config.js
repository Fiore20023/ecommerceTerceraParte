// Configuración de la API del Backend
// Cambiar según el entorno (desarrollo / producción)

const API_CONFIG = {
    // URL base del backend (desarrollo en localhost)
    BASE_URL: 'http://localhost:5500/api',
    
    // WhatsApp Business
    WHATSAPP: {
        NUMERO: '5491165677391',
        MENSAJE_DEFAULT: 'Hola! Quisiera consultar sobre un producto.'
    },
    
    // Endpoints
    ENDPOINTS: {
        PRODUCTOS: '/productos',
        CARRITO: '/carrito',
        CONTACTO: '/contacto'
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
    },
    
    getContactoUrl: function() {
        return this.BASE_URL + this.ENDPOINTS.CONTACTO;
    },
    
    getWhatsAppUrl: function(mensaje) {
        const mensajeEncoded = encodeURIComponent(mensaje || this.WHATSAPP.MENSAJE_DEFAULT);
        return `https://wa.me/${this.WHATSAPP.NUMERO}?text=${mensajeEncoded}`;
    }
};

// Hacer disponible globalmente
window.API_CONFIG = API_CONFIG;

console.log('✅ Configuración API cargada:', API_CONFIG.BASE_URL);
