// ------------------------------------------------
//             variables globales
// ------------------------------------------------

// ------------------------------------------------
//             funciones globales
// ------------------------------------------------
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
        let mensaje = `📩 *NUEVO MENSAJE DE CONTACTO*\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `👤 *Nombre:* ${payload.nombre}\n`;
        mensaje += `📧 *Email:* ${payload.email}\n`;
        if (payload.celular) mensaje += `📱 *Celular:* ${payload.celular}\n`;
        if (payload.pais) mensaje += `🌎 *País:* ${payload.pais}\n`;
        if (payload.provincia) mensaje += `📍 *Provincia:* ${payload.provincia}\n`;
        if (payload.ciudad) mensaje += `🏙️ *Ciudad:* ${payload.ciudad}\n`;
        mensaje += `\n💬 *Mensaje:*\n${payload.comentarios}\n`;
        mensaje += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `🕐 ${payload.createdAt}`;
        
        // Enviar por WhatsApp
        if (window.API_CONFIG && window.API_CONFIG.getWhatsAppUrl) {
            const url = window.API_CONFIG.getWhatsAppUrl(mensaje);
            window.open(url, '_blank');
            form.reset();
            if (typeof showToast === 'function') showToast('✅ Redirigiendo a WhatsApp...');
        } else {
            alert('⚠️ Error: Configuración de WhatsApp no disponible');
        }
    });
}

// auto-run when page loaded directly
if (document.readyState === 'complete' || document.readyState === 'interactive') initContacto();
