// ------------------------------------------------
//             variables globales
// ------------------------------------------------

// ------------------------------------------------
//             funciones globales
// ------------------------------------------------

// Función para enviar email
async function enviarPorEmail(payload) {
    try {
        // Crear el cuerpo del email en HTML
        const emailBody = `
            <h2>📩 Nuevo Mensaje de Contacto - Planeta Citroën</h2>
            <p><strong>Origen:</strong> Formulario de Contacto</p>
            <hr>
            <p><strong>👤 Nombre:</strong> ${payload.nombre}</p>
            <p><strong>📧 Email:</strong> ${payload.email}</p>
            ${payload.celular ? `<p><strong>📱 Celular:</strong> ${payload.celular}</p>` : ''}
            ${payload.pais ? `<p><strong>🌎 País:</strong> ${payload.pais}</p>` : ''}
            ${payload.provincia ? `<p><strong>📍 Provincia:</strong> ${payload.provincia}</p>` : ''}
            ${payload.ciudad ? `<p><strong>🏙️ Ciudad:</strong> ${payload.ciudad}</p>` : ''}
            <hr>
            <p><strong>💬 Mensaje:</strong></p>
            <p>${payload.comentarios}</p>
            <hr>
            <p><strong>🕐 Fecha:</strong> ${payload.createdAt}</p>
        `;

        // Crear mailto link como fallback
        const subject = `Nuevo mensaje de ${payload.nombre} - Sector Contacto`;
        const body = `Nombre: ${payload.nombre}\nEmail: ${payload.email}\n${payload.celular ? 'Celular: ' + payload.celular + '\n' : ''}${payload.pais ? 'País: ' + payload.pais + '\n' : ''}${payload.provincia ? 'Provincia: ' + payload.provincia + '\n' : ''}${payload.ciudad ? 'Ciudad: ' + payload.ciudad + '\n' : ''}\nMensaje:\n${payload.comentarios}\n\nOrigen: Formulario de Contacto\nFecha: ${payload.createdAt}`;
        
        const mailtoLink = `mailto:contacto@planetacitroen.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Abrir cliente de email en nueva ventana (no bloquea WhatsApp)
        window.open(mailtoLink, '_blank');
        
        console.log('✅ Email preparado para envío');
    } catch (error) {
        console.error('❌ Error al preparar email:', error);
    }
}

function initContacto(){
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    // Verificar si hay mensaje pre-cargado en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const mensajePrecargado = urlParams.get('mensaje');
    
    if (mensajePrecargado && form.comentarios) {
        form.comentarios.value = decodeURIComponent(mensajePrecargado);
        // Scroll al formulario
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateField(el){
        const name = el.name;
        let ok = true, msg = '';
        const val = el.value.trim();
        if (name === 'nombre') { if (!val) { ok = false; msg = 'Nombre requerido'; } }
    if (name === 'email') { const re = /\S+@\S+\.\S+/; if (!re.test(val)) { ok=false; msg='Email inválido'; } }
    if (name === 'comentarios') { if (!val || val.length < 5) { ok=false; msg='Escriba al menos 5 caracteres'; } }
    if (name === 'celular') { if (val && val.length < 7) { ok=false; msg='Número demasiado corto'; } }
    if (name === 'pais') { if (!val) { ok=false; msg='País requerido'; } }
    if (name === 'provincia') { if (!val) { ok=false; msg='Provincia requerida'; } }
    if (name === 'ciudad') { if (!val) { ok=false; msg='Ciudad requerida'; } }
        let err = el.nextElementSibling;
        if (!err || !err.classList || !err.classList.contains('field-error')){
            err = document.createElement('div'); err.className='field-error'; el.parentNode.insertBefore(err, el.nextSibling);
        }
        err.innerText = ok ? '' : msg;
        return ok;
    }

    ['nombre','email','comentarios','celular','pais','provincia','ciudad'].forEach(name=>{
        const el = form.elements[name]; if (!el) return;
        el.addEventListener('blur', ()=> validateField(el));
    });

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const els = ['nombre','email','comentarios'].map(n=> form.elements[n]);
        const allOk = els.map(el=> validateField(el)).every(Boolean);
        if (!allOk) { if (typeof showToast === 'function') showToast('Corrija los errores'); return; }

        const payload = { 
            nombre: form.nombre.value, 
            email: form.email.value, 
            celular: form.celular ? form.celular.value : '', 
            pais: form.pais ? form.pais.value : '', 
            provincia: form.provincia ? form.provincia.value : '', 
            ciudad: form.ciudad ? form.ciudad.value : '', 
            comentarios: form.comentarios.value, 
            createdAt: new Date().toLocaleString('es-AR')
        };
        
        // Crear mensaje para WhatsApp
        let mensaje = `📩 *NUEVO MENSAJE - SECTOR CONTACTO*\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `👤 *Nombre:* ${payload.nombre}\n`;
        mensaje += `📧 *Email:* ${payload.email}\n`;
        if (payload.celular) mensaje += `📱 *Celular:* ${payload.celular}\n`;
        if (payload.pais) mensaje += `🌎 *País:* ${payload.pais}\n`;
        if (payload.provincia) mensaje += `📍 *Provincia:* ${payload.provincia}\n`;
        if (payload.ciudad) mensaje += `🏙️ *Ciudad:* ${payload.ciudad}\n`;
        mensaje += `\n💬 *Mensaje:*\n${payload.comentarios}\n`;
        mensaje += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `🕐 ${payload.createdAt}\n`;
        mensaje += `📍 *Origen:* Formulario de Contacto`;
        
        // Enviar por Email
        enviarPorEmail(payload);
        
        // Enviar por WhatsApp - número directo
        const telefono = '5491165677391'; // WhatsApp de Planeta Citroën
        const mensajeEncoded = encodeURIComponent(mensaje);
        const whatsappUrl = `https://wa.me/${telefono}?text=${mensajeEncoded}`;
        
        // Abrir WhatsApp
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 500);
        
        form.reset();
        if (typeof showToast === 'function') {
            showToast('✅ Mensaje enviado! Redirigiendo a WhatsApp...');
        } else {
            alert('✅ Mensaje enviado! Redirigiendo a WhatsApp...');
        }
    });
}

// auto-run when page loaded directly
if (document.readyState === 'complete' || document.readyState === 'interactive') initContacto();
