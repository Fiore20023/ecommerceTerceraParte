# 🧪 Ejemplos de Pruebas de API

## 📋 Usando el Navegador

### 1. Ver información de la API
```
http://localhost:3001/api
```

### 2. Obtener todos los productos
```
http://localhost:3001/api/productos
```

### 3. Obtener un producto específico
```
http://localhost:3001/api/productos/AQUI_VA_EL_ID
```
*Ejemplo:* `http://localhost:3001/api/productos/674b5a8e9f1234567890abcd`

---

## 🔧 Usando PowerShell / CMD

### GET - Obtener productos
```powershell
curl http://localhost:3001/api/productos
```

### POST - Crear producto
```powershell
curl -X POST http://localhost:3001/api/productos `
  -H "Content-Type: application/json" `
  -d '{\"nombre\":\"Espejo Retrovisor\",\"precio\":1500,\"stock\":10,\"marca\":\"Citroen\",\"categoria\":\"Repuestos\",\"descripcion\":\"Espejo retrovisor izquierdo\"}'
```

### POST - Enviar carrito
```powershell
curl -X POST http://localhost:3001/api/carrito `
  -H "Content-Type: application/json" `
  -d '[{\"nombre\":\"Producto 1\",\"precio\":100,\"cantidad\":2},{\"nombre\":\"Producto 2\",\"precio\":200,\"cantidad\":1}]'
```

---

## 📮 Usando Postman

### Configuración Base
- **Base URL:** `http://localhost:3001/api`

### 1️⃣ GET - Listar todos los productos

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/api/productos`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "674b5a8e9f1234567890abcd",
      "nombre": "Espejo",
      "precio": 1200,
      "stock": 15,
      "marca": "Citroen",
      "categoria": "Carrocería",
      "descripcion": "Espejo retrovisor",
      "foto": "https://...",
      "activo": true
    }
  ],
  "total": 1
}
```

---

### 2️⃣ GET - Obtener producto por ID

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/api/productos/{id}`

**Example URL:**
```
http://localhost:3001/api/productos/674b5a8e9f1234567890abcd
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "674b5a8e9f1234567890abcd",
    "nombre": "Espejo",
    "precio": 1200,
    "stock": 15,
    "marca": "Citroen"
  }
}
```

---

### 3️⃣ POST - Crear nuevo producto

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/api/productos`
- Headers:
  - `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nombre": "Arbol de Levas",
  "precio": 8500,
  "stock": 5,
  "marca": "Promachine",
  "categoria": "Motorización",
  "descripcion": "Arbol de levas estándar",
  "foto": "https://ejemplo.com/imagen.jpg",
  "destacado": true
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "_id": "674b5a8e9f1234567890abce",
    "nombre": "Arbol de Levas",
    "precio": 8500,
    "stock": 5,
    "marca": "Promachine",
    "categoria": "Motorización",
    "descripcion": "Arbol de levas estándar",
    "foto": "https://ejemplo.com/imagen.jpg",
    "destacado": true,
    "activo": true,
    "fechaCreacion": "2025-11-30T...",
    "fechaActualizacion": "2025-11-30T..."
  }
}
```

---

### 4️⃣ PUT - Actualizar producto

**Request:**
- Method: `PUT`
- URL: `http://localhost:3001/api/productos/{id}`
- Headers:
  - `Content-Type: application/json`

**Example URL:**
```
http://localhost:3001/api/productos/674b5a8e9f1234567890abce
```

**Body (raw JSON):**
```json
{
  "nombre": "Arbol de Levas Premium",
  "precio": 9500,
  "stock": 3,
  "marca": "Promachine",
  "categoria": "Motorización",
  "descripcion": "Arbol de levas premium mejorado"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "_id": "674b5a8e9f1234567890abce",
    "nombre": "Arbol de Levas Premium",
    "precio": 9500,
    "stock": 3,
    "fechaActualizacion": "2025-11-30T..."
  }
}
```

---

### 5️⃣ DELETE - Eliminar producto

**Request:**
- Method: `DELETE`
- URL: `http://localhost:3001/api/productos/{id}`

**Example URL:**
```
http://localhost:3001/api/productos/674b5a8e9f1234567890abce
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente",
  "data": {
    "_id": "674b5a8e9f1234567890abce",
    "activo": false
  }
}
```

---

### 6️⃣ POST - Enviar carrito (Pedido)

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/api/carrito`
- Headers:
  - `Content-Type: application/json`

**Body (raw JSON):**
```json
[
  {
    "nombre": "Espejo Retrovisor",
    "precio": 1200,
    "cantidad": 2,
    "marca": "Citroen",
    "categoria": "Repuestos",
    "foto": "https://ejemplo.com/espejo.jpg"
  },
  {
    "nombre": "Arbol de Levas",
    "precio": 8500,
    "cantidad": 1,
    "marca": "Promachine",
    "categoria": "Motorización",
    "foto": "https://ejemplo.com/arbol.jpg"
  }
]
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Carrito procesado exitosamente",
  "data": {
    "pedidoId": "674b5a8e9f1234567890abcf",
    "totalProductos": 2,
    "total": 10900
  }
}
```

**Nota:** El servidor mostrará en consola:
```
🛒 ===== CARRITO RECIBIDO =====
📅 Fecha: 30/11/2025, 15:30:45
📦 Total de productos: 2

📋 Detalle de productos:

1. Espejo Retrovisor
   - Precio: $1200
   - Cantidad: 2
   - Subtotal: $2400.00

2. Arbol de Levas
   - Precio: $8500
   - Cantidad: 1
   - Subtotal: $8500.00

💰 TOTAL DEL PEDIDO: $10900.00
```

---

### 7️⃣ GET - Ver pedidos del carrito

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/api/carrito`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "674b5a8e9f1234567890abcf",
      "productos": [
        {
          "nombre": "Espejo Retrovisor",
          "precio": 1200,
          "cantidad": 2
        }
      ],
      "total": 10900,
      "fecha": "2025-11-30T18:30:45.123Z",
      "estado": "pendiente"
    }
  ],
  "total": 1
}
```

---

## 🚨 Respuestas de Error

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error al crear el producto",
  "error": "El nombre del producto es obligatorio"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "..."
}
```

---

## 📝 Notas Importantes

1. **IDs de MongoDB:** Son strings de 24 caracteres hexadecimales
2. **Campos obligatorios:** `nombre` y `precio`
3. **Soft Delete:** DELETE marca `activo: false`, no elimina permanentemente
4. **Carrito:** Debe ser un array de productos con `precio` y `cantidad`
5. **Validaciones:** El backend valida precios > 0 y stock >= 0

---

## 🎯 Flujo Completo de Prueba

1. ✅ GET `/api/productos` → Lista vacía
2. ✅ POST `/api/productos` → Crear 3 productos
3. ✅ GET `/api/productos` → Ver los 3 productos
4. ✅ GET `/api/productos/{id}` → Ver uno específico
5. ✅ PUT `/api/productos/{id}` → Actualizar precio
6. ✅ POST `/api/carrito` → Enviar pedido
7. ✅ GET `/api/carrito` → Ver pedidos
8. ✅ DELETE `/api/productos/{id}` → Eliminar producto

---

¡Listo para probar! 🚀
