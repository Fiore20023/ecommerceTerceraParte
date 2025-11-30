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
    }
};
