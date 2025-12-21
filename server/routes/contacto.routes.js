import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/contacto - Enviar formulario de contacto
router.post('/', async (req, res) => {
    try {
        const { nombre, email, celular, pais, provincia, ciudad, comentarios, createdAt } = req.body;

        // Validar datos requeridos
        if (!nombre || !email || !comentarios) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }

        // Configurar transportador de email (usando Gmail como ejemplo)
        // En producción, usar variables de entorno
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'tucorreo@gmail.com',
                pass: process.env.EMAIL_PASS || 'tupassword'
            }
        });

        // Configurar el email
        const mailOptions = {
            from: email,
            to: 'contacto@planetacitroen.ar',
            subject: `Nuevo mensaje de ${nombre} - Formulario de Contacto`,
            html: `
                <h2>📩 Nuevo Mensaje de Contacto - Planeta Citroën</h2>
                <p><strong>Origen:</strong> Formulario de Contacto</p>
                <hr>
                <p><strong>👤 Nombre:</strong> ${nombre}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                ${celular ? `<p><strong>📱 Celular:</strong> ${celular}</p>` : ''}
                ${pais ? `<p><strong>🌎 País:</strong> ${pais}</p>` : ''}
                ${provincia ? `<p><strong>📍 Provincia:</strong> ${provincia}</p>` : ''}
                ${ciudad ? `<p><strong>🏙️ Ciudad:</strong> ${ciudad}</p>` : ''}
                <hr>
                <p><strong>💬 Mensaje:</strong></p>
                <p>${comentarios}</p>
                <hr>
                <p><strong>🕐 Fecha:</strong> ${createdAt}</p>
            `
        };

        // Enviar email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Mensaje enviado correctamente'
        });

    } catch (error) {
        console.error('Error al enviar contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje',
            error: error.message
        });
    }
});

export default router;
