# 🚀 Guía de Despliegue - Ecommerce Backend

## ✅ Estado Actual
- ✅ Backend funcionando en http://localhost:3001
- ✅ Conectado a MongoDB Atlas
- ✅ Frontend integrado con el backend
- ✅ CRUD de productos implementado
- ✅ Sistema de carrito implementado

---

## 📋 Paso 1: Probar las Rutas de la API

### **Abrir el navegador y probar:**

1. **Página de inicio del API:**
   ```
   http://localhost:3001/api
   ```
   Deberías ver la documentación de endpoints disponibles.

2. **Ver todos los productos:**
   ```
   http://localhost:3001/api/productos
   ```
   Al principio estará vacío: `{"success":true,"data":[],"total":0}`

### **Crear productos de prueba:**

Abre el frontend en:
```
http://localhost:3001/index.html
```

Ve a la sección **"Alta"** y crea algunos productos de prueba.

---

## 📤 Paso 2: Subir a GitHub

### **1. Inicializar Git (si no está inicializado):**

```bash
git init
git add .
git commit -m "Backend ecommerce con Node.js, Express y MongoDB"
```

### **2. Crear repositorio en GitHub:**

1. Ve a https://github.com
2. Click en **"New repository"**
3. Nombre: `ecommerce-backend` (o el que prefieras)
4. **NO** marques "Initialize with README"
5. Click en **"Create repository"**

### **3. Conectar y subir:**

```bash
git remote add origin https://github.com/TU_USUARIO/ecommerce-backend.git
git branch -M main
git push -u origin main
```

---

## ☁️ Paso 3: Desplegar en Heroku (Producción)

### **URL de Producción Actual:**
```
https://planeta-citroen-api-8e0a0fc0bda1.herokuapp.com/api
```

---

## 🔄 Opción A: Despliegue Automático desde GitHub (RECOMENDADO)

Este proyecto está configurado para desplegarse automáticamente a Heroku cuando haces `push` a la rama `main`.

### **Configuración inicial (solo una vez):**

#### **1. Obtener tu Heroku API Key:**
```bash
heroku login
heroku auth:token
```
Copia el token que aparece.

#### **2. Configurar Secrets en GitHub:**

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Agrega estos tres secrets:

| Secret Name | Value |
|------------|-------|
| `HEROKU_API_KEY` | Tu API key de Heroku |
| `HEROKU_APP_NAME` | `planeta-citroen-api-8e0a0fc0bda1` |
| `HEROKU_EMAIL` | Tu email de Heroku |

### **Uso diario - Desplegar cambios:**

```bash
# 1. Hacer cambios en tu código
# 2. Commit
git add .
git commit -m "Descripción de cambios"

# 3. Push a GitHub - ¡El despliegue es automático!
git push origin main
```

### **Monitorear el despliegue:**
- Ve a **Actions** en GitHub para ver el progreso
- Los logs aparecen en tiempo real
- ✅ El despliegue tarda ~2-3 minutos

📖 **Guía completa:** [HEROKU-AUTO-DEPLOY.md](HEROKU-AUTO-DEPLOY.md)

---

## 🛠️ Opción B: Despliegue Manual con Heroku CLI

### **Pasos para desplegar manualmente en Heroku:**

#### **1. Instalar Heroku CLI:**
Descarga e instala desde: https://devcenter.heroku.com/articles/heroku-cli

#### **2. Iniciar sesión en Heroku:**
```bash
heroku login
```

#### **3. Crear una nueva aplicación en Heroku:**
```bash
heroku create nombre-de-tu-app
```

Esto creará una aplicación con URL: `https://nombre-de-tu-app.herokuapp.com`

#### **4. Configurar variables de entorno en Heroku:**

Desde la terminal:
```bash
heroku config:set MONGODB_URI="mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
heroku config:set DB_NAME="ecommerce"
heroku config:set PRODUCTOS_COLLECTION="productos"
heroku config:set CARRITO_COLLECTION="carritos"
heroku config:set MP_ACCESS_TOKEN="TU_TOKEN_DE_MERCADOPAGO"
heroku config:set EMAIL_USER="tu-email@gmail.com"
heroku config:set EMAIL_PASSWORD="tu-password-de-app"
```

O desde el dashboard de Heroku:
1. Ve a https://dashboard.heroku.com/apps
2. Selecciona tu aplicación
3. Ve a **Settings** → **Config Vars**
4. Agrega las variables de entorno

#### **5. Verificar archivos necesarios:**

**Procfile** (ya incluido):
```
web: node server.js
```

**package.json** - Asegúrate que tenga:
```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

#### **6. Desplegar a Heroku:**
```bash
# Agregar Heroku como remoto (si no se hizo automáticamente)
heroku git:remote -a nombre-de-tu-app

# Hacer push a Heroku
git push heroku main
```

#### **7. Verificar el despliegue:**
```bash
# Ver logs en tiempo real
heroku logs --tail

# Abrir la aplicación en el navegador
heroku open

# Verificar el estado
heroku ps
```

#### **8. Actualizar la URL en el frontend:**

Edita `js/config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'https://nombre-de-tu-app.herokuapp.com/api',
    // ...
};
```

### **Comandos útiles de Heroku:**

```bash
# Ver información de la app
heroku info

# Ver variables de entorno
heroku config

# Reiniciar la aplicación
heroku restart

# Ejecutar comandos en Heroku
heroku run bash

# Ver logs en tiempo real
heroku logs --tail
```

---

## ☁️ Paso 4: Desplegar en Glitch (alternativa)

### **Opción A: Importar desde GitHub (Recomendado)**

1. Ve a https://glitch.com
2. Click en **"New Project"** → **"Import from GitHub"**
3. Pega la URL de tu repositorio: `https://github.com/TU_USUARIO/ecommerce-backend`
4. Glitch clonará automáticamente tu proyecto

### **Opción B: Crear proyecto manualmente**

1. Ve a https://glitch.com
2. Click en **"New Project"** → **"glitch-hello-node"**
3. En el editor de Glitch:
   - Elimina los archivos de ejemplo
   - Sube tus archivos (puedes arrastrar carpetas)
   - O usa "Tools" → "Import from GitHub"

### **4. Configurar variables de entorno en Glitch:**

1. En tu proyecto de Glitch, click en **".env"** (izquierda)
2. Agrega las variables:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=ecommerce
PRODUCTOS_COLLECTION=productos
CARRITO_COLLECTION=carritos
```

### **5. Actualizar la URL del frontend:**

Una vez desplegado en Glitch, obtendrás una URL como:
```
https://tu-proyecto.glitch.me
```

Edita `js/config.js` y cambia:

```javascript
BASE_URL: 'https://tu-proyecto.glitch.me/api',
```

---

## 🧪 Paso 5: Probar con Postman (Opcional)

### **Instalar Postman:**
Descarga desde: https://www.postman.com/downloads/

### **Pruebas básicas:**

1. **GET - Obtener productos:**
   - Método: `GET`
   - URL: `http://localhost:3001/api/productos`

2. **POST - Crear producto:**
   - Método: `POST`
   - URL: `http://localhost:3001/api/productos`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "nombre": "Producto Test",
     "precio": 100,
     "stock": 10,
     "marca": "Test",
     "categoria": "Test",
     "descripcion": "Producto de prueba",
     "foto": "https://via.placeholder.com/150"
   }
   ```

3. **PUT - Actualizar producto:**
   - Método: `PUT`
   - URL: `http://localhost:3001/api/productos/{ID_DEL_PRODUCTO}`
   - Body: JSON con los campos a actualizar

4. **DELETE - Eliminar producto:**
   - Método: `DELETE`
   - URL: `http://localhost:3001/api/productos/{ID_DEL_PRODUCTO}`

5. **POST - Enviar carrito:**
   - Método: `POST`
   - URL: `http://localhost:3001/api/carrito`
   - Body (raw JSON):
   ```json
   [
     {
       "nombre": "Producto 1",
       "precio": 100,
       "cantidad": 2
     }
   ]
   ```

---

## 📦 Paso 6: Crear ZIP para entregar

```bash
# Asegúrate de estar en la carpeta del proyecto
# El .gitignore ya excluye node_modules

# En Windows PowerShell:
Compress-Archive -Path * -DestinationPath ecommerce-proyecto-final.zip
```

---

## ✅ Checklist de Entrega

- [ ] Código funcionando localmente
- [ ] Base de datos en MongoDB Atlas configurada
- [ ] Productos de prueba creados
- [ ] Repositorio en GitHub creado y actualizado
- [ ] Proyecto desplegado en Heroku (Producción) funcionando
- [ ] Proyecto desplegado en Glitch (opcional/alternativa) funcionando
- [ ] ZIP del proyecto sin node_modules
- [ ] README.md con instrucciones

---

## 📝 URLs a entregar:

1. **GitHub:** `https://github.com/TU_USUARIO/ecommerce-backend`
2. **Heroku (Producción):** `https://planeta-citroen-api-8e0a0fc0bda1.herokuapp.com/api`
3. **Glitch (alternativa):** `https://tu-proyecto.glitch.me`
4. **ZIP:** `ecommerce-proyecto-final.zip`

---

## 🔧 Comandos Útiles

```bash
# Iniciar servidor local
npm start

# Instalar dependencias
npm install

# Ver logs en Glitch
Ir a "Tools" → "Logs"
```

---

## 💡 Notas Importantes

1. **MongoDB Atlas:** Asegúrate de que tu IP esté en la whitelist (o usa 0.0.0.0/0 para desarrollo)
2. **CORS:** El servidor ya tiene CORS habilitado para recibir peticiones del frontend
3. **Puerto:** En Glitch se usa automáticamente el puerto 3000, no cambiar
4. **Persistencia:** Los datos quedan guardados en MongoDB Atlas, no en Glitch

---

## 🆘 Solución de Problemas

### **Error de conexión a MongoDB:**
- Verifica las credenciales en `.env`
- Verifica la IP whitelist en MongoDB Atlas

### **Puerto ocupado:**
- Cambia el puerto en `.env`
- Mata el proceso: `npx kill-port 3001`

### **Frontend no se conecta:**
- Verifica que `js/config.js` tenga la URL correcta
- Abre la consola del navegador (F12) para ver errores

---

¡Éxito! 🎉
