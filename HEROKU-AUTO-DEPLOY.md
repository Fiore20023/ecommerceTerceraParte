# 🔄 Despliegue Automático a Heroku desde GitHub

> 📍 **Estás aquí:** Este archivo está en el repositorio de GitHub  
> 💡 **Esta es la guía COMPLETA** - Si buscas algo más rápido, ve a: [GUIA-RAPIDA-HEROKU.md](GUIA-RAPIDA-HEROKU.md)  
> ❓ **¿No sabes cómo acceder a las guías?** Lee: [COMO-USAR-GUIAS.md](COMO-USAR-GUIAS.md)

---

## 📋 Descripción

Este proyecto está configurado para desplegarse **automáticamente** a Heroku cada vez que se hace `push` a la rama `main` en GitHub. Esto elimina la necesidad de desplegar manualmente usando `git push heroku main`.

## ⚙️ Configuración Inicial (Solo una vez)

### Paso 1: Obtener tu API Key de Heroku

1. Inicia sesión en Heroku:
   ```bash
   heroku login
   ```

2. Obtén tu API key:
   ```bash
   heroku auth:token
   ```
   
   Copia el token que aparece (ejemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Paso 2: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Agrega los siguientes secrets:

#### Secret 1: HEROKU_API_KEY
- **Name:** `HEROKU_API_KEY`
- **Value:** Tu API key de Heroku (el token del Paso 1)

#### Secret 2: HEROKU_APP_NAME
- **Name:** `HEROKU_APP_NAME`
- **Value:** `planeta-citroen-api-8e0a0fc0bda1` (o el nombre de tu app en Heroku)

#### Secret 3: HEROKU_EMAIL
- **Name:** `HEROKU_EMAIL`
- **Value:** El email que usas para iniciar sesión en Heroku

## 🚀 Cómo Funciona el Despliegue Automático

Una vez configurados los secrets, el despliegue es completamente automático:

1. **Haces cambios** en tu código localmente
2. **Haces commit de los cambios:**
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   ```
3. **Haces push** a GitHub:
   ```bash
   git push origin main
   ```
4. **GitHub Actions** detecta el push automáticamente
5. **Se despliega** a Heroku sin intervención manual
6. **Verifica** el despliegue en: https://planeta-citroen-api-8e0a0fc0bda1.herokuapp.com/api

## 📊 Monitorear el Despliegue

### Ver el progreso en GitHub

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Verás todos los despliegues (workflows) ejecutándose o completados
4. Click en cualquier workflow para ver los detalles y logs

### Ver logs en Heroku

```bash
# Ver logs en tiempo real
heroku logs --tail --app planeta-citroen-api-8e0a0fc0bda1

# Ver logs recientes
heroku logs --app planeta-citroen-api-8e0a0fc0bda1
```

## 🔧 Despliegue Manual (Alternativa)

Si prefieres desplegar manualmente o si GitHub Actions no está disponible:

```bash
# Agregar Heroku como remoto (solo primera vez)
heroku git:remote -a planeta-citroen-api-8e0a0fc0bda1

# Desplegar manualmente
git push heroku main
```

## ✅ Ventajas del Despliegue Automático

- ✨ **Sin comandos extra**: Solo haz `git push origin main`
- 🚀 **Rápido**: Despliegue inmediato después del push
- 📝 **Historial**: Todos los despliegues quedan registrados en Actions
- 🔄 **Consistente**: Mismo proceso para todos los colaboradores
- 🛡️ **Seguro**: Las credenciales están en secrets cifrados

## 🐛 Solución de Problemas

### El despliegue falla en GitHub Actions

1. Ve a **Actions** → Click en el workflow fallido
2. Revisa los logs para ver el error
3. Verifica que los secrets estén configurados correctamente
4. Asegúrate de que el nombre de la app en Heroku sea correcto

### Error: "Invalid credentials"

- Verifica que `HEROKU_API_KEY` esté correctamente configurado
- Regenera tu API key: `heroku authorizations:create`

### Error: "App not found"

- Verifica que `HEROKU_APP_NAME` sea exactamente el nombre de tu app en Heroku
- Verifica que tengas acceso a la app: `heroku apps:info -a nombre-app`

### El despliegue funciona pero la app no responde

```bash
# Verifica el estado de la app
heroku ps --app planeta-citroen-api-8e0a0fc0bda1

# Reinicia la app
heroku restart --app planeta-citroen-api-8e0a0fc0bda1

# Verifica las variables de entorno
heroku config --app planeta-citroen-api-8e0a0fc0bda1
```

## 📚 Recursos Adicionales

- [Documentación de GitHub Actions](https://docs.github.com/en/actions)
- [Heroku Deploy GitHub Action](https://github.com/marketplace/actions/deploy-to-heroku)
- [Documentación de Heroku](https://devcenter.heroku.com/)

## 🔐 Seguridad

- ⚠️ **Nunca** compartas tu `HEROKU_API_KEY` públicamente
- ⚠️ **Nunca** hagas commit de tu API key en el código
- ✅ **Siempre** usa GitHub Secrets para credenciales
- ✅ Revoca y regenera tu API key si crees que fue comprometida

## 📝 Notas

- El archivo de configuración está en: `.github/workflows/heroku-deploy.yml`
- El despliegue solo ocurre en push a la rama `main`
- Puedes modificar el workflow para desplegar en otras ramas si es necesario
