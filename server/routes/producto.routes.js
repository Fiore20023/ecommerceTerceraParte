import express from 'express';
import { productoController } from '../controllers/producto.controller.js';

const router = express.Router();

// GET /api/productos - Obtener todos los productos
router.get('/', productoController.getAll.bind(productoController));

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', productoController.getById.bind(productoController));

// POST /api/productos - Crear un nuevo producto
router.post('/', productoController.create.bind(productoController));

// PUT /api/productos/:id - Actualizar un producto existente
router.put('/:id', productoController.update.bind(productoController));

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', productoController.delete.bind(productoController));

export default router;
