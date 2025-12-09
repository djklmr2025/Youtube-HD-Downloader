# 🚀 Guía de Deployment - YouTube Playlist Extractor

## 📦 Arquitectura del Proyecto

```
Frontend (GitHub Pages) → Backend API (Render) → Selenium → YouTube
```

---

## 🎯 PASO 1: Deploy del Backend en Render

### 1.1 Crear cuenta en Render
1. Ve a: https://render.com
2. Click en "Get Started for Free"
3. Regístrate con GitHub

### 1.2 Crear Web Service
1. Click en "New +" → "Web Service"
2. Conecta tu repositorio: `djklmr2025/Youtube-HD-Downloader`
3. Configuración:
   - **Name**: `youtube-playlist-extractor`
   - **Region**: Oregon (US West) o el más cercano
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### 1.3 Variables de Entorno
Agregar en "Environment":
```
GOOGLE_CHROME_BIN=/usr/bin/google-chrome
CHROMEDRIVER_PATH=/usr/bin/chromedriver
PORT=10000
```

### 1.4 Configurar Buildpacks (IMPORTANTE)
En "Settings" → "Build & Deploy" → "Build Command", usar:
```bash
# Instalar Chrome
apt-get update && apt-get install -y wget gnupg
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable

# Instalar ChromeDriver
CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)
wget -q "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VERSION}" -O /tmp/version
CHROMEDRIVER_VERSION=$(cat /tmp/version)
wget -q "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" -O /tmp/chromedriver.zip
unzip -o /tmp/chromedriver.zip -d /usr/local/bin/
chmod +x /usr/local/bin/chromedriver

# Instalar dependencias Python
pip install -r requirements.txt
```

### 1.5 Deploy
1. Click en "Create Web Service"
2. Espera 5-10 minutos mientras se construye
3. Una vez completado, verás la URL: `https://youtube-playlist-extractor.onrender.com`

---

## 🌐 PASO 2: Deploy del Frontend en GitHub Pages

### 2.1 Actualizar la URL del API
1. Abre `frontend/index.html`
2. Busca la línea:
   ```javascript
   const API_URL = 'https://youtube-playlist-extractor.onrender.com';
   ```
3. Reemplaza con tu URL de Render (del paso 1.5)

### 2.2 Habilitar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: `Deploy from a branch`
4. Branch: `main`
5. Folder: `/frontend`
6. Click "Save"

### 2.3 Acceder a tu sitio
Después de 1-2 minutos, tu sitio estará en:
```
https://djklmr2025.github.io/Youtube-HD-Downloader/
```

---

## ✅ PASO 3: Verificar que todo funciona

### 3.1 Probar el Backend
```bash
curl -X POST https://youtube-playlist-extractor.onrender.com/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/playlist?list=PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo"}'
```

Deberías recibir un JSON con los videos.

### 3.2 Probar el Frontend
1. Abre: `https://djklmr2025.github.io/Youtube-HD-Downloader/`
2. Pega una URL de playlist
3. Click en "Extraer Todos los Videos"
4. Deberías ver los resultados en 30-60 segundos

---

## 🔧 Troubleshooting

### Error: "Chrome binary not found"
**Solución**: Verifica que el build command incluya la instalación de Chrome

### Error: "Connection refused"
**Solución**: 
1. Verifica que el backend esté activo en Render
2. Revisa los logs en Render Dashboard
3. Asegúrate de que la URL del API en el frontend sea correcta

### El backend se duerme después de 15 minutos
**Solución**: Render Free tier duerme servicios inactivos. Opciones:
1. Upgrade a plan pagado ($7/mes)
2. Usar un servicio de "ping" como UptimeRobot para mantenerlo activo
3. Aceptar que la primera request tarde ~30 segundos (mientras despierta)

### Timeout en playlists muy grandes
**Solución**: Aumentar el timeout en `app.py`:
```python
# En la función extract()
max_scrolls=50  # Aumentar de 20 a 50
```

---

## 💡 Alternativas a Render

### Railway (Recomendado)
- Más rápido que Render
- $5/mes de crédito gratis
- Deploy: https://railway.app

### Heroku
- $7/mes (sin plan gratuito)
- Más estable
- Deploy: https://heroku.com

### Fly.io
- Plan gratuito generoso
- Más complejo de configurar
- Deploy: https://fly.io

---

## 📊 Costos Estimados

| Servicio | Plan | Costo |
|----------|------|-------|
| **Render** | Free | $0/mes (con limitaciones) |
| **Render** | Starter | $7/mes (recomendado) |
| **GitHub Pages** | Free | $0/mes |
| **Railway** | Hobby | $5/mes de crédito gratis |

**Recomendación**: Empieza con Render Free, si funciona bien, upgrade a $7/mes.

---

## 🎉 ¡Listo!

Tu aplicación ahora está 100% en línea:
- ✅ Frontend en GitHub Pages
- ✅ Backend en Render
- ✅ Sin límite de 100 videos
- ✅ Sin API Key necesaria para usuarios
- ✅ Gratis (o $7/mes para mejor rendimiento)

---

## 📝 Notas Importantes

1. **Primera request lenta**: El backend en Render Free se duerme después de 15 min de inactividad. La primera request puede tardar 30-60 segundos mientras despierta.

2. **Límites de Render Free**:
   - 750 horas/mes (suficiente para uso moderado)
   - Se duerme después de 15 min de inactividad
   - 512 MB RAM

3. **Actualizar el código**:
   - Backend: Push a GitHub → Render auto-deploya
   - Frontend: Push a GitHub → GitHub Pages auto-actualiza

4. **Monitoreo**:
   - Logs del backend: Render Dashboard → Logs
   - Errores del frontend: Consola del navegador (F12)

---

**¿Necesitas ayuda?** Abre un issue en GitHub: https://github.com/djklmr2025/Youtube-HD-Downloader/issues
