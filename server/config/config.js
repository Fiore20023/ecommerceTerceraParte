import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Exportar configuración del servidor
export const config = {
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGODB_URI,
        dbName: process.env.DB_NAME || 'ecommerce',
        collections: {
            productos: process.env.PRODUCTOS_COLLECTION || 'productos',
            carrito: process.env.CARRITO_COLLECTION || 'carritos'
        }
    },
    mercadopago: {
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        publicKey: process.env.MERCADOPAGO_PUBLIC_KEY
    },
    app: {
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
        backendUrl: process.env.BACKEND_URL || 'http://localhost:3001'
    }
};
