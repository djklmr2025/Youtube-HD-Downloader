# 🎬 YouTube Playlist Extractor - 100% Completo

Extrae **TODOS** los videos de cualquier playlist de YouTube sin límites y sin API Key.

## ✨ Características

- ✅ **100% de los videos** - Sin límite de 100
- ✅ **Sin API Key** - No requiere configuración de Google Cloud  
- ✅ **Scroll automático** - Simula navegación real
- ✅ **Múltiples formatos** - JSON, CSV, TXT, DLC
- ✅ **Rápido y confiable** - Usa Selenium WebDriver
- ✅ **Validación automática** - Detecta duplicados y errores
- ✅ **Logging completo** - Reportes detallados de progreso
- ✅ **CLI avanzado** - Argumentos personalizables

## 📦 Versiones Disponibles

### 1. **Versión Web con Backend** ⭐ **RECOMENDADO PARA PRODUCCIÓN**
- 🌐 100% en línea (GitHub Pages + Render)
- 🚀 Extrae el 100% de videos sin límites
- 🔓 Sin API Key necesaria para usuarios
- ⚡ Rápido y confiable
- 📁 Archivos: `frontend/index.html` + `backend/app.py`
- 📖 [Ver guía de deployment](DEPLOYMENT.md)

### 2. **Versión Web Simple (`index.html`)** - Para uso local
- 3 métodos de extracción
- Interfaz gráfica intuitiva
- Requiere API Key para 100% de videos

### 3. **Script Básico (`extract_playlist.py`)** - Simple y directo
- Extracción automática
- Genera 4 formatos de salida

### 4. **Script Avanzado (`extract_playlist_advanced.py`)** - Más robusto
- Logging completo con archivos de log
- Validación de duplicados
- Detección inteligente de scroll
- CLI con múltiples opciones
- Reportes detallados de progreso

## 📋 Requisitos

1. **Python 3.7+**
2. **Google Chrome** instalado
3. **ChromeDriver** (se instala automáticamente con Selenium)

## 🚀 Instalación

### Paso 1: Instalar Python
Si no tienes Python, descárgalo de: https://www.python.org/downloads/

### Paso 2: Instalar dependencias
```bash
pip install -r requirements.txt
```

O manualmente:
```bash
pip install selenium
```

## 💻 Uso

### Método 1: Ejecutar directamente
```bash
python extract_playlist.py
```
Por defecto extrae la playlist: `PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo`

### Método 2: Con URL personalizada
```bash
python extract_playlist.py "https://www.youtube.com/playlist?list=TU_PLAYLIST_ID"
```

### Método 3: Versión Avanzada (RECOMENDADO) ⭐

#### Uso básico:
```bash
python extract_playlist_advanced.py
```

#### Con URL personalizada:
```bash
python extract_playlist_advanced.py "https://www.youtube.com/playlist?list=TU_PLAYLIST_ID"
```

#### Con todas las opciones:
```bash
python extract_playlist_advanced.py "URL_PLAYLIST" \
  --expected 119 \
  --output mi_playlist \
  --pause 3 \
  --no-headless
```

#### Argumentos disponibles:
- `url`: URL de la playlist (opcional, usa playlist por defecto si no se proporciona)
- `-e, --expected`: Número esperado de videos (para validación)
- `-o, --output`: Nombre base para archivos de salida (default: "playlist")
- `--pause`: Tiempo de pausa entre scrolls en segundos (default: 2)
- `--no-headless`: Mostrar ventana del navegador (útil para debugging)

#### Ejemplos:

**Extraer playlist con validación:**
```bash
python extract_playlist_advanced.py "https://youtube.com/playlist?list=ABC123" --expected 119
```

**Ver el proceso en tiempo real:**
```bash
python extract_playlist_advanced.py --no-headless
```

**Playlist muy grande (más lenta):**
```bash
python extract_playlist_advanced.py "URL" --pause 3 --expected 500
```

## 📁 Archivos generados

El script genera 4 archivos:

1. **`playlist_ID.json`** - Datos completos en JSON
   ```json
   {
     "playlist_url": "...",
     "total_videos": 119,
     "videos": [
       {
         "index": 1,
         "title": "Video Title",
         "video_id": "abc123",
         "url": "https://youtube.com/watch?v=abc123"
       }
     ]
   }
   ```

2. **`playlist_ID_urls.txt`** - Solo URLs (una por línea)
   ```
   https://www.youtube.com/watch?v=abc123
   https://www.youtube.com/watch?v=def456
   ```

3. **`playlist_ID.csv`** - Formato CSV para Excel
   ```csv
   Index,Title,Video ID,URL
   1,"Video Title",abc123,https://youtube.com/watch?v=abc123
   ```

4. **`playlist_ID.dlc`** - Para JDownloader
   Archivo DLC compatible con JDownloader y otros gestores de descargas

## 🎯 Ejemplo de salida

```
============================================================
🎬 YOUTUBE PLAYLIST EXTRACTOR - 100% COMPLETO
============================================================

🎵 Iniciando extracción de playlist...
📍 URL: https://www.youtube.com/playlist?list=PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo

🚀 Iniciando navegador...
⏳ Cargando página inicial...
📜 Ejecutando scroll infinito...

   Scroll 1: 100 videos cargados
   Scroll 2: 115 videos cargados
   Scroll 3: 119 videos cargados

✅ Scroll completo - No hay más videos para cargar

📊 Extrayendo información de 119 videos...

   ✓ Video 1: RAYOS GAMERS DE LUZ 🌈 FONDO ANIMADO...
   ✓ Video 2: PARTICULAS DE LUZ 🌈 FONDO ANIMADO...
   ...
   ✓ Video 119: DESTELLO DE LUZ...

✅ Extracción completada: 119 videos

============================================================
💾 GUARDANDO RESULTADOS
============================================================

💾 JSON guardado: playlist_PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo.json
💾 TXT guardado: playlist_PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo_urls.txt
💾 CSV guardado: playlist_PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo.csv
💾 DLC guardado: playlist_PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo.dlc

============================================================
✅ ¡ÉXITO! 119 videos extraídos y guardados
============================================================
```

## 🔧 Solución de problemas

### Error: "chromedriver not found"
```bash
# Instalar webdriver-manager
pip install webdriver-manager

# Luego modifica extract_playlist.py para usar:
from webdriver_manager.chrome import ChromeDriverManager
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
```

### Error: "Chrome binary not found"
- Asegúrate de tener Google Chrome instalado
- O usa Firefox: cambia `webdriver.Chrome()` por `webdriver.Firefox()`

### El script es muy lento
- Es normal, debe esperar que YouTube cargue los videos
- Para playlists grandes (500+ videos) puede tomar 2-5 minutos

## 📊 Comparación con otros métodos

| Método | API Key | Límite | Velocidad | Confiabilidad |
|--------|---------|--------|-----------|---------------|
| **Este script (Selenium)** | ❌ No | ✅ Sin límite | ⚡ Rápido | ✅ 100% |
| YouTube Data API | ✅ Sí | ✅ Sin límite | ⚡⚡ Muy rápido | ✅ 100% |
| Web scraping simple | ❌ No | ⚠️ ~100 videos | ⚡⚡⚡ Instantáneo | ⚠️ 85% |

## 🌐 Versiones web

También hay versiones HTML disponibles:

- **`index-simple.html`** - Básico, ~100 videos
- **`index-api.html`** - Requiere API Key, sin límites
- **`index-complete.html`** - Híbrido con modal para API Key

## 📝 Notas

- El script usa modo **headless** (sin ventana visible)
- Respeta los términos de servicio de YouTube
- Solo funciona con playlists **públicas**
- No descarga videos, solo extrae URLs

## 🤝 Contribuciones

¿Encontraste un bug o tienes una mejora? ¡Abre un issue o pull request!

## 📄 Licencia

MIT License - Usa libremente

---

**Creado con ❤️ para obtener el 100% de tus playlists**
