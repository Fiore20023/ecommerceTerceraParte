import express from 'express';
import { mercadoPagoController } from '../controllers/mercadopago.controller.js';

const router = express.Router();

// POST /api/mercadopago/create-preference - Crear preferencia de pago
router.post('/create-preference', mercadoPagoController.createPreference.bind(mercadoPagoController));

// POST /api/mercadopago/webhook - Webhook para notificaciones
router.post('/webhook', mercadoPagoController.webhook.bind(mercadoPagoController));

export default router;
