# Integración de Mercado Pago

## 📋 Pasos completados

✅ SDK de Mercado Pago instalado (`mercadopago`)
✅ Controlador de Mercado Pago creado (`server/controllers/mercadopago.controller.js`)
✅ Rutas de Mercado Pago configuradas (`server/routes/mercadopago.routes.js`)
✅ Páginas de resultado creadas:
   - `success.html` - Pago exitoso
   - `failure.html` - Pago cancelado/rechazado
   - `pending.html` - Pago pendiente
✅ Botón de Mercado Pago agregado al carrito
✅ Lógica de frontend para crear preferencias

## 🔑 Configuración de credenciales

### 1. Obtener credenciales de Mercado Pago

1. Ve a: https://www.mercadopago.com.ar/developers/panel
2. Inicia sesión o crea una cuenta
3. Ve a **"Tus aplicaciones"** → **"Crear aplicación"**
4. Selecciona **"Pagos online"**
5. Completa el nombre de la aplicación
6. Copia tus **credenciales de prueba**:
   - **Public Key** (comienza con `TEST-` o `APP_USR-`)
   - **Access Token** (comienza con `TEST-` o `APP_USR-`)

### 2. Agregar credenciales al archivo .env

Edita el archivo `.env` y agrega:

```env
# Mercado Pago (credenciales de prueba)
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX-XXXXXXX
MERCADOPAGO_PUBLIC_KEY=TEST-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

# URLs de la aplicación
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3001
```

### 3. Reiniciar el servidor

```bash
npm start
```

## 🧪 Probar la integración

### Tarjetas de prueba de Mercado Pago

**Tarjeta aprobada:**
- Número: `5031 7557 3453 0604`
- CVV: Cualquier 3 dígitos
- Fecha: Cualquier fecha futura
- Nombre: APRO

**Tarjeta rechazada:**
- Número: `5031 7557 3453 0604`  
- CVV: Cualquier 3 dígitos
- Fecha: Cualquier fecha futura
- Nombre: OTHE

**Tarjeta pendiente:**
- Número: `5031 7557 3453 0604`
- CVV: Cualquier 3 dígitos
- Fecha: Cualquier fecha futura
- Nombre: CONT

## 🛒 Flujo de pago

1. Usuario agrega productos al carrito
2. En el modal del carrito, click en **"Pagar con Mercado Pago"**
3. Se crea una preferencia de pago en el backend
4. Usuario es redirigido al checkout de Mercado Pago
5. Usuario completa el pago
6. Mercado Pago redirige a:
   - `success.html` si el pago fue exitoso
   - `failure.html` si fue rechazado
   - `pending.html` si está pendiente

## 📡 Endpoints de la API

### POST /api/mercadopago/create-preference
Crea una preferencia de pago

**Request:**
```json
{
  "items": [
    {
      "title": "Producto",
      "unit_price": 1000,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "preferenceId": "1234567890-abc123",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
}
```

### POST /api/mercadopago/webhook
Recibe notificaciones de Mercado Pago (IPN)

## 🔐 Seguridad

- ⚠️ **NUNCA** subas el `.env` a GitHub
- ✅ Usa credenciales de **prueba** para desarrollo
- ✅ Usa credenciales de **producción** solo en producción
- ✅ El Access Token debe estar en el backend, nunca en el frontend

## 📚 Documentación oficial

- SDK Node.js: https://www.mercadopago.com.ar/developers/es/docs/sdks-library/server-side
- Checkout Pro: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing
- Tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/test-cards

