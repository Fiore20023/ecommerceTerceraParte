import { productoModel } from '../models/producto.model.js';

class ProductoController {
    // GET /api/productos - Obtener todos los productos
    async getAll(req, res) {
        try {
            const productos = await productoModel.findAll();
            
            res.status(200).json({
                success: true,
                data: productos,
                total: productos.length
            });
        } catch (error) {
            console.error('Error en getAll:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los productos',
                error: error.message
            });
        }
    }

    // GET /api/productos/:id - Obtener un producto por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const producto = await productoModel.findById(id);

            res.status(200).json({
                success: true,
                data: producto
            });
        } catch (error) {
            console.error('Error en getById:', error);
            const statusCode = error.message.includes('inválido') || error.message.includes('no encontrado') ? 404 : 500;
            
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/productos - Crear un nuevo producto
    async create(req, res) {
        try {
            const productoData = req.body;
            console.log('📥 Datos recibidos del frontend:', JSON.stringify(productoData, null, 2));
            console.log('📸 Campo foto recibido:', productoData.foto);
            console.log('📸 Campo imagen recibido:', productoData.imagen);
            
            const producto = await productoModel.create(productoData);

            console.log('✅ Producto creado:', producto);

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: producto
            });
        } catch (error) {
            console.error('Error en create:', error);
            res.status(400).json({
                success: false,
                message: 'Error al crear el producto',
                error: error.message
            });
        }
    }

    // PUT /api/productos/:id - Actualizar un producto existente
    async update(req, res) {
        try {
            const { id } = req.params;
            const productoData = req.body;
            
            const producto = await productoModel.update(id, productoData);

            console.log('✅ Producto actualizado:', producto);

            res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: producto
            });
        } catch (error) {
            console.error('Error en update:', error);
            const statusCode = error.message.includes('inválido') || error.message.includes('no encontrado') ? 404 : 400;
            
            res.status(statusCode).json({
                success: false,
                message: 'Error al actualizar el producto',
                error: error.message
            });
        }
    }

    // DELETE /api/productos/:id - Eliminar un producto
    async delete(req, res) {
        try {
            const { id } = req.params;
            const producto = await productoModel.delete(id);

            console.log('✅ Producto eliminado:', id);

            res.status(200).json({
                success: true,
                message: 'Producto eliminado exitosamente',
                data: producto
            });
        } catch (error) {
            console.error('Error en delete:', error);
            const statusCode = error.message.includes('inválido') || error.message.includes('no encontrado') ? 404 : 500;
            
            res.status(statusCode).json({
                success: false,
                message: 'Error al eliminar el producto',
                error: error.message
            });
        }
    }
}

export const productoController = new ProductoController();
