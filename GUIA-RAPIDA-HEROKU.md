# ⚡ Guía Rápida: Actualizar Heroku desde Git

## 🎯 Resumen en 3 Pasos

### 1️⃣ Configuración Inicial (Solo UNA vez)

En GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agregar estos 3 secrets:

| Name | Value | Cómo obtenerlo |
|------|-------|----------------|
| `HEROKU_API_KEY` | Tu token | `heroku auth:token` |
| `HEROKU_APP_NAME` | `planeta-citroen-api-8e0a0fc0bda1` | Nombre de tu app |
| `HEROKU_EMAIL` | tu-email@ejemplo.com | Tu email de Heroku |

### 2️⃣ Hacer Cambios y Actualizar

```bash
# Hacer tus cambios en el código

# Guardar cambios
git add .
git commit -m "Descripción de los cambios"

# ¡Enviar a GitHub y Heroku automáticamente!
git push origin main
```

### 3️⃣ Verificar el Despliegue

- 🔍 **Ver progreso:** GitHub → pestaña **Actions**
- 🌐 **Ver app:** https://planeta-citroen-api-8e0a0fc0bda1.herokuapp.com/api
- 📋 **Ver logs:** `heroku logs --tail`

---

## ❓ ¿Qué hace esto?

✅ Cada vez que haces `git push origin main`, GitHub automáticamente:
1. Toma tu código
2. Lo sube a Heroku
3. Reinicia la aplicación
4. ¡Todo sin comandos adicionales!

## 📚 Documentación Completa

- 📖 [HEROKU-AUTO-DEPLOY.md](HEROKU-AUTO-DEPLOY.md) - Guía detallada
- 📖 [README.md](README.md) - Información general
- 📖 [GUIA-DESPLIEGUE.md](GUIA-DESPLIEGUE.md) - Guía paso a paso

---

## 🆘 Ayuda Rápida

### ¿No funciona el despliegue?
1. Ve a **Actions** en GitHub
2. Click en el workflow más reciente
3. Revisa los logs de error
4. Verifica que los secrets estén bien configurados

### ¿Cómo ver los logs de Heroku?
```bash
heroku logs --tail --app planeta-citroen-api-8e0a0fc0bda1
```

### ¿Cómo reiniciar la app?
```bash
heroku restart --app planeta-citroen-api-8e0a0fc0bda1
```

---

**💡 Tip:** Después de la configuración inicial, solo necesitas `git push origin main` ¡y listo! 🚀
