# 🧪 GUÍA COMPLETA DE PRUEBAS - Sistema Dual Auto/Repuesto

## 📋 RESUMEN DE CAMBIOS

Se ha implementado un sistema dual para manejar dos tipos de productos:

### 🚗 AUTOS (Productos de Exhibición)
- **Campos**: Restauración, Modelo, Color, Kilómetros, Ubicación, Descripción
- **Stock**: Siempre 1 (único)
- **Imágenes**: Hasta 5 fotos almacenadas en Base64
- **Vista**: Se mostrarán con botón "Quiero verlo" (en lugar de "Comprar")

### 🔧 REPUESTOS (Productos de Inventario)
- **Campos**: Stock, Marca, Modelos compatibles (múltiples), Subcategoría, Color, Tamaño, Descripciones, Envío
- **Stock**: Variable (gestión de inventario)
- **Imágenes**: Hasta 5 fotos almacenadas en Base64
- **Vista**: Botón "Comprar" tradicional

---

## 🔐 PASO 1: AUTENTICACIÓN

### A. Crear cuenta de administrador
1. Abrir http://localhost:3001/registro.html
2. Registrar usuario (cualquier email, contraseña 6+ caracteres)
3. Verificar mensaje de éxito

### B. Iniciar sesión
1. Abrir http://localhost:3001/login.html
2. Ingresar credenciales
3. Verificar redirección al index

### C. Acceso al panel de administración
1. Hacer clic en botón "Login" en header
2. Automáticamente redirige a alta.html (si estás autenticado)
3. Verificar que se muestra el formulario de carga

---

## 🚗 PASO 2: CREAR UN AUTO

### Datos de prueba sugeridos:

1. **Seleccionar tipo**: Marcar radio button "Auto"
2. **Nombre**: `Citroën 2CV Charleston Restaurado`
3. **Precio**: `1500000`
4. **¿Es restauración?**: `Sí`
5. **Modelo de Auto**: `2CV`
6. **Color**: `Rojo y Negro (Charleston)`
7. **Kilómetros**: `45000`
8. **Ubicación**: `Buenos Aires, Argentina`
9. **Descripción**: 
   ```
   Hermoso Citroën 2CV Charleston completamente restaurado.
   Motor revisado, chapa y pintura original, interior restaurado.
   Papeles al día, listo para transferir.
   ```
10. **Imágenes**: Seleccionar 2-3 fotos (PNG, JPG, max 2MB c/u)

### Verificaciones:
- ✅ Vista previa de imágenes se muestra con tamaños
- ✅ Botón muestra "Agregando..." durante proceso
- ✅ Mensaje de éxito al finalizar
- ✅ Auto aparece en tabla con ícono 🚗
- ✅ Tabla muestra: modelo, km, color, ubicación
- ✅ Primera imagen se visualiza con contador "(X fotos)"

---

## 🔧 PASO 3: CREAR UN REPUESTO

### Datos de prueba sugeridos:

1. **Seleccionar tipo**: Marcar radio button "Repuesto"
2. **Nombre**: `Kit de Embrague Completo`
3. **Precio**: `45000`
4. **Stock**: `8`
5. **Marca**: `Valeo`
6. **Modelos compatibles**: Marcar `2CV`, `Dyane`, `Mehari` (o clic en "Todos")
7. **Tipo de Producto**: `Motores`
8. **Color**: `N/A`
9. **Tamaño**: `Universal`
10. **Descripción corta**: `Kit de embrague completo con disco, plato y crapodina`
11. **Descripción larga**: 
    ```
    Kit de embrague de primera calidad marca Valeo.
    Incluye disco de embrague, plato de presión y crapodina.
    Compatible con modelos 2CV, Dyane y Mehari.
    Instalación sencilla, viene con instrucciones.
    ```
12. **¿Ofrece envío?**: Marcar checkbox
13. **Imágenes**: Seleccionar 1-2 fotos

### Verificaciones:
- ✅ Checkbox "Todos" marca/desmarca todos los modelos
- ✅ Al desmarcar uno, "Todos" se desmarca automáticamente
- ✅ Vista previa de imágenes funciona
- ✅ Repuesto aparece en tabla con ícono 🔧
- ✅ Tabla muestra: modelos compatibles, stock, subcategoría, color
- ✅ Imágenes se visualizan correctamente

---

## ✏️ PASO 4: EDITAR PRODUCTOS

### A. Editar Auto
1. Click en botón ✏️ de un auto en la tabla
2. Verificar que:
   - Radio "Auto" está seleccionado
   - Todos los campos del auto se rellenan correctamente
   - Se muestra mensaje de imágenes existentes
3. Modificar un campo (ej: cambiar kilómetros)
4. Click "Actualizar"
5. Verificar cambios en tabla

### B. Editar Repuesto
1. Click en botón ✏️ de un repuesto
2. Verificar que:
   - Radio "Repuesto" está seleccionado
   - Checkboxes de modelos se marcan correctamente
   - Todos los campos se rellenan
3. Modificar stock o agregar modelo compatible
4. Click "Actualizar"
5. Verificar cambios en tabla

---

## 🔍 PASO 5: BUSCAR PRODUCTOS

### A. Búsqueda en Alta (tabla local)
1. Usar buscador en `alta.html`
2. Escribir: `2CV`
3. Verificar que filtra tanto autos como repuestos que contengan "2CV"
4. Borrar búsqueda para ver todos los productos

### B. Búsqueda global
1. Ir a `index.html`
2. Usar buscador del header
3. Escribir: `embrague`
4. Verificar redirección y filtrado correcto

---

## 🗑️ PASO 6: ELIMINAR PRODUCTO

1. Click en botón 🗑️ de cualquier producto
2. Confirmar en el diálogo
3. Verificar que se elimina de la tabla
4. Verificar mensaje de éxito

---

## 📸 PASO 7: VALIDACIÓN DE IMÁGENES

### Pruebas de límites:

#### A. Máximo 5 imágenes
1. Seleccionar 6+ imágenes
2. Verificar mensaje de advertencia
3. Solo se procesan las primeras 5

#### B. Tamaño máximo 2MB
1. Seleccionar imagen > 2MB
2. Verificar mensaje de error
3. Imagen se rechaza

#### C. Tipos permitidos
1. Probar con .jpg, .png, .gif, .webp ✅
2. Probar con .pdf, .txt ❌ Error
3. Solo tipos de imagen válidos

#### D. Vista previa
1. Seleccionar imágenes válidas
2. Verificar miniaturas se muestran
3. Ver tamaños en KB/MB debajo de cada imagen

---

## 🔄 PASO 8: VERIFICAR BASE DE DATOS

### Estructura de documento AUTO en MongoDB:
```json
{
  "_id": ObjectId("..."),
  "tipoProducto": "auto",
  "nombre": "Citroën 2CV Charleston Restaurado",
  "precio": 1500000,
  "stock": 1,
  "restauracion": "si",
  "modeloAuto": "2CV",
  "categoria": "2CV",
  "colorAuto": "Rojo y Negro (Charleston)",
  "kilometros": 45000,
  "ubicacion": "Buenos Aires, Argentina",
  "descripcionAuto": "Hermoso Citroën 2CV...",
  "descripcion": "Hermoso Citroën 2CV...",
  "imagenes": [
    {
      "nombre": "2cv-charleston.jpg",
      "tipo": "image/jpeg",
      "datos": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
    },
    {
      "nombre": "2cv-interior.jpg",
      "tipo": "image/jpeg",
      "datos": "data:image/jpeg;base64,iVBORw0KGgoAAAANS..."
    }
  ],
  "activo": true,
  "fechaCreacion": ISODate("2025-12-20T..."),
  "fechaActualizacion": ISODate("2025-12-20T...")
}
```

### Estructura de documento REPUESTO en MongoDB:
```json
{
  "_id": ObjectId("..."),
  "tipoProducto": "repuesto",
  "nombre": "Kit de Embrague Completo",
  "precio": 45000,
  "stock": 8,
  "marca": "Valeo",
  "modelos": ["2CV", "Dyane", "Mehari"],
  "categoria": "2CV, Dyane, Mehari",
  "subcategoria": "Motores",
  "color": "N/A",
  "tamano": "Universal",
  "descripcion-corta": "Kit de embrague completo...",
  "descripcion": "Kit de embrague completo...",
  "descripcion-larga": "Kit de embrague de primera calidad...",
  "envio": true,
  "imagenes": [
    {
      "nombre": "embrague-kit.png",
      "tipo": "image/png",
      "datos": "data:image/png;base64,iVBORw0KGgoAAAANS..."
    }
  ],
  "activo": true,
  "destacado": false,
  "fechaCreacion": ISODate("2025-12-20T..."),
  "fechaActualizacion": ISODate("2025-12-20T...")
}
```

---

## 🌐 PASO 9: VERIFICAR VISUALIZACIÓN EN INDEX

### A. Vista actual (temporal)
Actualmente `index.html` muestra todos los productos igual.

### B. Modificación pendiente
Se debe actualizar para:
- **Autos**: Mostrar botón "Quiero verlo" → formulario de contacto
- **Repuestos**: Mostrar botón "Comprar" → agregar al carrito
- Diferentes estilos de cards según tipo

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### Error: "API_CONFIG no disponible"
**Solución**: Verificar que `main.js` se carga antes que `alta.js` en el HTML

### Error: "uploadImages is not defined"
**Solución**: Verificar que `upload-images.js` está incluido en alta.html

### No se ven las imágenes en la tabla
**Causa**: Las imágenes antiguas usan campo `foto` (URL), las nuevas usan `imagenes` (Base64)
**Solución**: El código ya maneja ambos casos con fallback

### Checkbox "Todos" no funciona
**Solución**: Recargar página, verificar que el JavaScript de alta.js se ejecutó

### Formulario no cambia entre Auto/Repuesto
**Solución**: Verificar que los radio buttons tienen `id="tipo-auto"` y `id="tipo-repuesto"`

---

## 🎯 CHECKLIST DE FUNCIONALIDADES

### Autenticación
- [ ] Registro de usuario
- [ ] Login
- [ ] Logout
- [ ] Protección de alta.html (redirige si no autenticado)

### Gestión de Autos
- [ ] Crear auto con imágenes Base64
- [ ] Ver auto en tabla con datos correctos
- [ ] Editar auto (carga datos correctamente)
- [ ] Eliminar auto

### Gestión de Repuestos
- [ ] Crear repuesto con múltiples modelos
- [ ] Checkbox "Todos" funciona
- [ ] Ver repuesto en tabla
- [ ] Editar repuesto (checkboxes se marcan bien)
- [ ] Eliminar repuesto

### Imágenes
- [ ] Subir múltiples imágenes (hasta 5)
- [ ] Validación de tamaño (max 2MB)
- [ ] Validación de tipo (solo imágenes)
- [ ] Vista previa funciona
- [ ] Imágenes se guardan en Base64
- [ ] Imágenes se visualizan en tabla

### Búsqueda
- [ ] Búsqueda local en alta.html
- [ ] Búsqueda global desde index.html
- [ ] Filtrado correcto por tipo de producto

---

## 📊 PRÓXIMOS PASOS

1. **Actualizar index.html**
   - Detectar `tipoProducto` en cada producto
   - Mostrar cards diferentes para autos vs repuestos
   - Autos: botón "Quiero verlo" → formulario contacto
   - Repuestos: botón "Comprar" → agregar a carrito

2. **Actualizar producto-detalle.html**
   - Layout específico para autos (galería, specs, ubicación)
   - Layout específico para repuestos (stock, modelos, agregar cantidad)

3. **Optimización de imágenes**
   - Considerar compresión automática al subir
   - Implementar lazy loading en galería

4. **Mejoras UX**
   - Drag & drop para ordenar imágenes
   - Crop/resize de imágenes antes de subir
   - Indicador de progreso durante carga

---

## 🐛 DEBUG

Para ver logs detallados en la consola del navegador:

```javascript
// En alta.html, abrir DevTools (F12) y ver:
- 📸 Procesando imágenes...
- ✅ X imágenes procesadas
- 📦 Producto completo a enviar: {...}
- 📤 Creando/Actualizando producto...
- ✅ Producto guardado: {...}
```

Para ver logs del backend:

```
// En la terminal donde corre el servidor:
POST /api/productos - fecha/hora
📥 Datos recibidos del frontend: {...}
✅ Producto creado: {...}
```

---

## 📞 CONTACTO Y SOPORTE

Si encuentras algún problema:

1. Verificar que el servidor está corriendo (puerto 3001)
2. Verificar conexión a MongoDB Atlas
3. Limpiar caché del navegador (Ctrl+Shift+Delete)
4. Revisar consola de DevTools (F12)
5. Verificar que todos los archivos JS están incluidos en HTML

---

**¡Sistema dual Auto/Repuesto implementado con éxito! 🎉**
