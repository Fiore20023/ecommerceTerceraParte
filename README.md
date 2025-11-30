# 🛒 Ecommerce - Backend con Node.js, Express y MongoDB

Backend completo para proyecto de ecommerce desarrollado con **Node.js**, **Express** y **MongoDB Atlas**, siguiendo el patrón de arquitectura **MVC** (Modelo-Vista-Controlador).

## 📋 Características

- ✅ API RESTful con Express
- ✅ CRUD completo de productos
- ✅ Conexión a MongoDB Atlas
- ✅ Arquitectura MVC (Modelo-Vista-Controlador)
- ✅ Gestión de carritos de compra
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ CORS habilitado para frontend

## 🚀 Endpoints de la API

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/productos` | Obtener todos los productos |
| `GET` | `/api/productos/:id` | Obtener un producto por ID |
| `POST` | `/api/productos` | Crear un nuevo producto |
| `PUT` | `/api/productos/:id` | Actualizar un producto |
| `DELETE` | `/api/productos/:id` | Eliminar un producto |

### Carrito

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/carrito` | Procesar carrito del frontend |
| `GET` | `/api/carrito` | Obtener historial de pedidos |

## 📦 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd ecommerceSegundaParte-main
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
copy .env.example .env
```

Edita el archivo `.env` y configura tu conexión a MongoDB Atlas:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
DB_NAME=ecommerce
```

**Para obtener tu MONGODB_URI:**

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster
4. Click en "Connect" → "Connect your application"
5. Copia la cadena de conexión y reemplaza `<username>` y `<password>`

### 4. Iniciar el servidor

```bash
npm start
```

Para desarrollo con auto-reload:

```bash
npm run dev
```

El servidor estará corriendo en: **http://localhost:3000**

## 🏗️ Estructura del Proyecto

```
ecommerceSegundaParte-main/
├── server/
│   ├── config/
│   │   ├── config.js          # Configuración general
│   │   └── database.js        # Conexión a MongoDB
│   ├── models/
│   │   └── producto.model.js  # Modelo de Producto
│   ├── controllers/
│   │   ├── producto.controller.js  # Lógica de productos
│   │   └── carrito.controller.js   # Lógica de carrito
│   ├── routes/
│   │   ├── producto.routes.js      # Rutas de productos
│   │   └── carrito.routes.js       # Rutas de carrito
│   └── middlewares/
├── css/                       # Estilos del frontend
├── js/                        # JavaScript del frontend
├── images/                    # Imágenes
├── *.html                     # Páginas HTML
├── server.js                  # Servidor principal
├── package.json               # Dependencias
├── .env                       # Variables de entorno (no subir a Git)
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore                # Archivos a ignorar en Git
└── README.md                 # Este archivo
```

## 🧪 Probar la API

### Usando el navegador

Visita: http://localhost:3000/api

### Usando cURL (Ejemplos)

**Obtener todos los productos:**
```bash
curl http://localhost:3000/api/productos
```

**Crear un producto:**
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Producto Test\",\"precio\":100,\"stock\":10}"
```

**Enviar carrito:**
```bash
curl -X POST http://localhost:3000/api/carrito \
  -H "Content-Type: application/json" \
  -d "[{\"nombre\":\"Producto 1\",\"precio\":50,\"cantidad\":2}]"
```

## 🔗 Integración con Frontend

En tu código JavaScript del frontend, usa `fetch` para conectarte al backend:

```javascript
// Obtener productos
fetch('http://localhost:3000/api/productos')
  .then(response => response.json())
  .then(data => console.log(data));

// Enviar carrito
fetch('http://localhost:3000/api/carrito', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(carritoArray)
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🌐 Desplegar en Glitch

1. Ve a [Glitch.com](https://glitch.com)
2. Crea un nuevo proyecto
3. Importa el código desde GitHub
4. Configura las variables de entorno en `.env`
5. El proyecto se desplegará automáticamente

## 📤 Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit - Backend ecommerce"
git branch -M main
git remote add origin <tu-repositorio>
git push -u origin main
```

## 📝 Ejemplo de Producto

```json
{
  "nombre": "Notebook Lenovo",
  "descripcion": "Notebook 15.6 pulgadas",
  "precio": 85000,
  "stock": 5,
  "categoria": "Tecnología",
  "imagen": "https://ejemplo.com/imagen.jpg",
  "destacado": true
}
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **MongoDB Driver** - Driver nativo de MongoDB
- **dotenv** - Variables de entorno
- **CORS** - Permitir peticiones entre dominios

## 📄 Licencia

ISC

## 👤 Autor

Proyecto desarrollado para el curso de desarrollo web.

---

**¡Listo para usar!** 🎉
