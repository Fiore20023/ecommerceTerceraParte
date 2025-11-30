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

## ☁️ Paso 3: Desplegar en Glitch

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
MONGODB_URI=mongodb+srv://planetacitroenseo_db_user:kDT6bhvN7nmNVgqL@cluster0.mkhyuei.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
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

## 🧪 Paso 4: Probar con Postman (Opcional)

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

## 📦 Paso 5: Crear ZIP para entregar

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
- [ ] Proyecto desplegado en Glitch funcionando
- [ ] ZIP del proyecto sin node_modules
- [ ] README.md con instrucciones

---

## 📝 URLs a entregar:

1. **GitHub:** `https://github.com/TU_USUARIO/ecommerce-backend`
2. **Glitch:** `https://tu-proyecto.glitch.me`
3. **ZIP:** `ecommerce-proyecto-final.zip`

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
