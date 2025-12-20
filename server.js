import express from 'express';
import cors from 'cors';
import { config } from './server/config/config.js';
import { database } from './server/config/database.js';
import productoRoutes from './server/routes/producto.routes.js';
import carritoRoutes from './server/routes/carrito.routes.js';
import mercadoPagoRoutes from './server/routes/mercadopago.routes.js';

// Crear aplicación Express
const app = express();

// ===== MIDDLEWARES =====

// CORS - Permitir peticiones desde el frontend
app.use(cors({
    origin: '*', // En producción, especificar el dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser de JSON (límite aumentado para imágenes en Base64)
app.use(express.json({ limit: '50mb' }));

// Parser de URL encoded (límite aumentado para imágenes en Base64)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static('.'));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString('es-AR')}`);
    next();
});

// ===== RUTAS =====

// Ruta raíz
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API de Ecommerce funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            productos: {
                getAll: 'GET /api/productos',
                getById: 'GET /api/productos/:id',
                create: 'POST /api/productos',
                update: 'PUT /api/productos/:id',
                delete: 'DELETE /api/productos/:id'
            },
            carrito: {
                procesar: 'POST /api/carrito',
                getPedidos: 'GET /api/carrito'
            },
            mercadopago: {
                createPreference: 'POST /api/mercadopago/create-preference',
                webhook: 'POST /api/mercadopago/webhook'
            }
        }
    });
});

// Rutas de productos
app.use('/api/productos', productoRoutes);

// Rutas de carrito
app.use('/api/carrito', carritoRoutes);

// Rutas de Mercado Pago
app.use('/api/mercadopago', mercadoPagoRoutes);

// Ruta 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ===== INICIAR SERVIDOR =====

async function startServer() {
    try {
        // Conectar a la base de datos
        await database.connect();

        // Iniciar servidor
        const PORT = config.port;
        app.listen(PORT, () => {
            console.log('\n🚀 ===== SERVIDOR INICIADO =====');
            console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
            console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
            console.log(`📦 Base de datos: ${config.mongodb.dbName}`);
            console.log('================================\n');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Manejar cierre del servidor
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Cerrando servidor...');
    await database.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n\n🛑 Cerrando servidor...');
    await database.disconnect();
    process.exit(0);
});

// Iniciar el servidor
startServer();
