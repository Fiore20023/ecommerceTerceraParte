import express from 'express';
import { carritoController } from '../controllers/carrito.controller.js';

const router = express.Router();

// POST /api/carrito - Procesar el carrito del frontend
router.post('/', carritoController.procesarCarrito.bind(carritoController));

// GET /api/carrito - Obtener todos los pedidos (opcional)
router.get('/', carritoController.getPedidos.bind(carritoController));

export default router;
