// Configuración de Firebase
// REEMPLAZAR con tus credenciales de Firebase Console

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAMC0DUG3XdCAd8TteYyaqj7bu02zPT49A",
    authDomain: "ecommerce-planeta-citroen.firebaseapp.com",
    projectId: "ecommerce-planeta-citroen",
    storageBucket: "ecommerce-planeta-citroen.firebasestorage.app",
    messagingSenderId: "410485766058",
    appId: "1:410485766058:web:d79969e7d96eba81379dd3",
    measurementId: "G-FQX8KELNJC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
