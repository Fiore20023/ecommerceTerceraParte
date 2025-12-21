// ------------------------------------------------
//             variables globales
// ------------------------------------------------

// ------------------------------------------------
//             funciones globales
// ------------------------------------------------

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear el contenedor de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <span class="notificacion-icono">${tipo === 'success' ? '✅' : '⚠️'}</span>
            <span class="notificacion-texto">${mensaje}</span>
        </div>
    `;
    
    // Estilos inline para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-size: 1rem;
        font-weight: 500;
        max-width: 400px;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 4000);
}

// Agregar animaciones CSS si no existen
if (!document.getElementById('notificacion-styles')) {
    const style = document.createElement('style');
    style.id = 'notificacion-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        .notificacion-contenido {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notificacion-icono {
            font-size: 1.5rem;
        }
    `;
    document.head.appendChild(style);
}

// Función para enviar email
function enviarPorEmail(payload) {
    try {
        // Crear mailto link
        const subject = `Nuevo mensaje de ${payload.nombre} - Formulario de Contacto`;
        const body = `DATOS DEL CONTACTO:\n\nNombre: ${payload.nombre}\nEmail: ${payload.email}\n${payload.celular ? 'Celular: ' + payload.celular + '\n' : ''}${payload.pais ? 'País: ' + payload.pais + '\n' : ''}${payload.provincia ? 'Provincia: ' + payload.provincia + '\n' : ''}${payload.ciudad ? 'Ciudad: ' + payload.ciudad + '\n' : ''}\nMENSAJE:\n${payload.comentarios}\n\nFecha: ${payload.createdAt}`;
        
        const mailtoLink = `mailto:contacto@planetacitroen.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Crear un enlace invisible y hacer click
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Email enviado');
        return true;
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        return false;
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

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const els = ['nombre','email','comentarios'].map(n=> form.elements[n]);
        const allOk = els.map(el=> validateField(el)).every(Boolean);
        if (!allOk) { 
            mostrarNotificacion('⚠️ Por favor, corrija los errores en el formulario', 'error');
            return; 
        }

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
        
        try {
            // Enviar al backend
            const response = await fetch(window.API_CONFIG.getContactoUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                mostrarNotificacion('✅ Mensaje enviado exitosamente!', 'success');
                form.reset();
            } else {
                throw new Error('Error al enviar');
            }
        } catch (error) {
            console.error('Error:', error);
            // Si falla el backend, usar mailto como fallback
            mostrarNotificacion('📧 Abriendo cliente de email...', 'success');
            form.reset();
            setTimeout(() => {
                enviarPorEmail(payload);
            }, 500);
        }
    });
}

// auto-run when page loaded directly
if (document.readyState === 'complete' || document.readyState === 'interactive') initContacto();
