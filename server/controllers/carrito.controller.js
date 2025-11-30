import { database } from '../config/database.js';
import { config } from '../config/config.js';

class CarritoController {
    // POST /api/carrito - Recibir y procesar el carrito del frontend
    async procesarCarrito(req, res) {
        try {
            const carrito = req.body;

            // Validar que el carrito sea un array
            if (!Array.isArray(carrito)) {
                return res.status(400).json({
                    success: false,
                    message: 'El carrito debe ser un array de productos'
                });
            }

            // Validar que el carrito no esté vacío
            if (carrito.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El carrito está vacío'
                });
            }

            // Mostrar información del carrito en la consola del servidor
            console.log('\n🛒 ===== CARRITO RECIBIDO =====');
            console.log(`📅 Fecha: ${new Date().toLocaleString('es-AR')}`);
            console.log(`📦 Total de productos: ${carrito.length}`);
            console.log('\n📋 Detalle de productos:');
            
            let totalPedido = 0;
            carrito.forEach((producto, index) => {
                const subtotal = (producto.precio || 0) * (producto.cantidad || 1);
                totalPedido += subtotal;
                
                console.log(`\n${index + 1}. ${producto.nombre || 'Sin nombre'}`);
                console.log(`   - Precio: $${producto.precio || 0}`);
                console.log(`   - Cantidad: ${producto.cantidad || 1}`);
                console.log(`   - Subtotal: $${subtotal.toFixed(2)}`);
            });

            console.log(`\n💰 TOTAL DEL PEDIDO: $${totalPedido.toFixed(2)}`);
            console.log('================================\n');

            // Guardar el carrito en la base de datos (opcional)
            try {
                const collection = database.getCollection(config.mongodb.collections.carrito);
                
                const pedido = {
                    productos: carrito,
                    total: totalPedido,
                    fecha: new Date(),
                    estado: 'pendiente'
                };

                const result = await collection.insertOne(pedido);
                
                console.log(`✅ Pedido guardado en la base de datos con ID: ${result.insertedId}`);

                res.status(200).json({
                    success: true,
                    message: 'Carrito procesado exitosamente',
                    data: {
                        pedidoId: result.insertedId,
                        totalProductos: carrito.length,
                        total: totalPedido
                    }
                });
            } catch (dbError) {
                console.warn('⚠️  No se pudo guardar en la base de datos:', dbError.message);
                
                // Aunque falle el guardado, el pedido fue recibido
                res.status(200).json({
                    success: true,
                    message: 'Carrito recibido (no guardado en BD)',
                    data: {
                        totalProductos: carrito.length,
                        total: totalPedido
                    }
                });
            }

        } catch (error) {
            console.error('❌ Error al procesar el carrito:', error);
            res.status(500).json({
                success: false,
                message: 'Error al procesar el carrito',
                error: error.message
            });
        }
    }

    // GET /api/carrito - Obtener todos los pedidos (opcional)
    async getPedidos(req, res) {
        try {
            const collection = database.getCollection(config.mongodb.collections.carrito);
            const pedidos = await collection.find({}).sort({ fecha: -1 }).toArray();

            res.status(200).json({
                success: true,
                data: pedidos,
                total: pedidos.length
            });
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los pedidos',
                error: error.message
            });
        }
    }
}

export const carritoController = new CarritoController();
