import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { config } from '../config/config.js';

class MercadoPagoController {
    constructor() {
        // Configurar cliente de Mercado Pago
        this.client = new MercadoPagoConfig({ 
            accessToken: config.mercadopago.accessToken 
        });
        this.preferenceClient = new Preference(this.client);
        this.paymentClient = new Payment(this.client);
    }

    // POST /api/mercadopago/create-preference - Crear preferencia de pago
    async createPreference(req, res) {
        try {
            const { items, payer } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe enviar al menos un item para el pago'
                });
            }

            // Crear la preferencia de pago
            const preference = {
                items: items.map(item => ({
                    title: item.title || item.nombre,
                    unit_price: Number(item.unit_price || item.precio),
                    quantity: Number(item.quantity || item.qty || 1),
                    currency_id: 'ARS' // Pesos argentinos
                })),
                back_urls: {
                    success: `${config.app.frontendUrl}/success.html`,
                    failure: `${config.app.frontendUrl}/failure.html`,
                    pending: `${config.app.frontendUrl}/pending.html`
                },
                notification_url: `${config.app.backendUrl}/api/mercadopago/webhook`,
                statement_descriptor: 'PLANETA CITROEN',
                external_reference: `ORDER-${Date.now()}`
            };

            console.log('📦 Creando preferencia de pago:', preference);

            const response = await this.preferenceClient.create({ body: preference });

            console.log('✅ Preferencia creada:', response.id);

            res.status(200).json({
                success: true,
                data: {
                    id: response.id,
                    init_point: response.init_point,
                    sandbox_init_point: response.sandbox_init_point
                }
            });

        } catch (error) {
            console.error('❌ Error al crear preferencia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear preferencia de pago',
                error: error.message
            });
        }
    }

    // POST /api/mercadopago/webhook - Recibir notificaciones de pago
    async webhook(req, res) {
        try {
            const { type, data } = req.body;

            console.log('🔔 Webhook recibido:', { type, data });

            if (type === 'payment') {
                const paymentId = data.id;
                
                // Obtener información del pago
                const payment = await this.paymentClient.get({ id: paymentId });
                
                console.log('💳 Pago recibido:', {
                    id: payment.id,
                    status: payment.status,
                    amount: payment.transaction_amount,
                    externalReference: payment.external_reference
                });

                // Aquí puedes actualizar el estado del pedido en tu base de datos
                // según el estado del pago (approved, rejected, pending, etc.)
            }

            res.status(200).send('OK');

        } catch (error) {
            console.error('❌ Error en webhook:', error);
            res.status(500).send('Error');
        }
    }
}

export const mercadoPagoController = new MercadoPagoController();
