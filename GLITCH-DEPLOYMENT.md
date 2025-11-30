# ⚡ Despliegue Rápido en Glitch

## 🚀 Pasos para Glitch

### 1️⃣ Crear cuenta en Glitch
- Ve a https://glitch.com
- Regístrate con GitHub (recomendado) o email

### 2️⃣ Importar proyecto desde GitHub

**Opción A - Si ya subiste a GitHub:**
1. En Glitch: **New Project** → **Import from GitHub**
2. Pega: `https://github.com/TU_USUARIO/ecommerce-backend`
3. ¡Listo! Glitch clonará tu proyecto

**Opción B - Subir manualmente:**
1. En Glitch: **New Project** → **glitch-hello-node**
2. Borra los archivos de ejemplo
3. Click en **Tools** → **Import from GitHub**
4. O arrastra tus archivos directamente

### 3️⃣ Configurar Variables de Entorno

1. Click en el archivo **`.env`** (panel izquierdo)
2. Copia y pega esto:

```env
PORT=3000
MONGODB_URI=mongodb+srv://planetacitroenseo_db_user:kDT6bhvN7nmNVgqL@cluster0.mkhyuei.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=ecommerce
PRODUCTOS_COLLECTION=productos
CARRITO_COLLECTION=carritos
```

3. Guarda (Ctrl+S)

### 4️⃣ Verificar package.json

Asegúrate de que `package.json` tenga:

```json
{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.3.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  }
}
```

### 5️⃣ Esperar que Glitch instale dependencias

- Glitch automáticamente ejecuta `npm install`
- Verás en **Logs** (Tools → Logs): "Installing dependencies..."
- Cuando termine, el servidor iniciará automáticamente

### 6️⃣ Obtener tu URL pública

Tu proyecto estará en:
```
https://TU-PROYECTO-NAME.glitch.me
```

**Ejemplo:**
```
https://ecommerce-backend-abc123.glitch.me
```

### 7️⃣ Actualizar el Frontend

Edita `js/config.js` y cambia la URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://TU-PROYECTO-NAME.glitch.me/api',
    // ...resto del código
};
```

### 8️⃣ Probar tu API

Abre en el navegador:
```
https://TU-PROYECTO-NAME.glitch.me/api
```

Deberías ver la documentación de la API.

---

## 🎯 URL Final del Frontend

Tu frontend estará disponible en:
```
https://TU-PROYECTO-NAME.glitch.me/index.html
```

---

## ✅ Verificar que funciona

1. **API respondiendo:**
   - Ve a: `https://TU-PROYECTO.glitch.me/api`
   - Deberías ver JSON con la info de endpoints

2. **Frontend conectado:**
   - Ve a: `https://TU-PROYECTO.glitch.me/index.html`
   - Abre la consola (F12)
   - Deberías ver: "✅ Configuración API cargada"

3. **Crear un producto:**
   - Ve a la sección "Alta"
   - Crea un producto de prueba
   - Verifica en "Inicio" que aparece

4. **Probar carrito:**
   - Agrega productos al carrito
   - Ve a "Carrito"
   - Click en "Finalizar Compra"
   - Verifica en los Logs de Glitch que se recibió

---

## 🔍 Ver Logs en Glitch

1. Click en **Tools** (abajo izquierda)
2. Click en **Logs**
3. Verás todos los `console.log` del servidor

---

## 📦 Para entregar

**Necesitas:**

1. ✅ URL de GitHub: `https://github.com/TU-USUARIO/repo`
2. ✅ URL de Glitch: `https://tu-proyecto.glitch.me`
3. ✅ ZIP del código (sin node_modules)

---

## 🆘 Problemas Comunes

### **"Application Error" en Glitch**
- Ve a Logs y verifica el error
- Usualmente es problema con `.env` o `package.json`

### **No se conecta a MongoDB**
- Verifica que copiaste bien el MONGODB_URI en `.env`
- Asegúrate de tener IP 0.0.0.0/0 en Network Access de MongoDB Atlas

### **Frontend no carga**
- Verifica que todos los archivos HTML, CSS, JS estén en Glitch
- Verifica la URL en `js/config.js`

---

## 💡 Extras

### **Hacer el proyecto privado:**
- Click en **Settings** → **Make This Project Private**

### **Compartir el proyecto:**
- Click en **Share** (arriba derecha)
- Copia el link

### **Editar código en Glitch:**
- Glitch tiene un editor integrado
- Los cambios se guardan automáticamente
- El servidor se reinicia automáticamente

---

¡Listo! 🎉
