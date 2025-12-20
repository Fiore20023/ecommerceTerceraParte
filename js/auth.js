// Sistema de autenticación con Firebase
import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Elementos del DOM
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Función para mostrar mensajes de error
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

// Función para mostrar mensajes de éxito
function showSuccess(message) {
    if (successMessage) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

// Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando sesión...';
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ Login exitoso:', userCredential.user.email);
            showSuccess('¡Bienvenido! Redirigiendo...');
            
            // Redirigir al panel de administración
            setTimeout(() => {
                window.location.href = 'alta.html';
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error en login:', error);
            
            let errorMsg = 'Error al iniciar sesión';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMsg = 'Correo electrónico inválido';
                    break;
                case 'auth/user-disabled':
                    errorMsg = 'Usuario deshabilitado';
                    break;
                case 'auth/user-not-found':
                    errorMsg = 'Usuario no encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMsg = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-credential':
                    errorMsg = 'Credenciales inválidas. Verifica tu email y contraseña';
                    break;
                default:
                    errorMsg = error.message;
            }
            
            showError(errorMsg);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });
}

// Función para cerrar sesión (se exporta para usarla en otras páginas)
export async function logout() {
    try {
        await signOut(auth);
        console.log('✅ Sesión cerrada');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
    }
}

// Verificar estado de autenticación (se exporta para usarla en otras páginas)
export function checkAuth(redirectToLogin = true) {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('✅ Usuario autenticado:', user.email);
                resolve(user);
            } else {
                console.log('❌ Usuario no autenticado');
                if (redirectToLogin) {
                    window.location.href = 'login.html';
                }
                resolve(null);
            }
        });
    });
}

// Exportar auth para usar en otros módulos
export { auth };
