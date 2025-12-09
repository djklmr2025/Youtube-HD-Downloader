# 🎵 YouTube Playlist URL Extractor

Una herramienta simple y efectiva para extraer URLs de videos de playlists de YouTube.

## ✨ Características

- ✅ **Sin APIs ni autenticación** - Funciona directamente
- ✅ **100% gratis** - No requiere claves de API
- ✅ **Extracción rápida** - Obtén todas las URLs en segundos
- ✅ **Copiar o descargar** - Copia al portapapeles o descarga como .txt
- ✅ **Interfaz moderna** - Diseño limpio y fácil de usar
- ✅ **Responsive** - Funciona en móvil, tablet y desktop

## 🚀 Cómo usar

1. **Obtén el URL de la playlist**
   - Ve a YouTube y abre cualquier playlist pública
   - Copia el URL de la barra de direcciones
   - Ejemplo: `https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf`

2. **Extrae las URLs**
   - Pega el URL en el campo de entrada
   - Haz clic en "Extraer URLs"
   - Espera unos segundos

3. **Usa los resultados**
   - **Copiar**: Haz clic en "📋 Copiar Todo" para copiar todas las URLs
   - **Descargar**: Haz clic en "💾 Descargar .txt" para guardar un archivo

## 🌐 Despliegue

### Vercel (Recomendado)

Este proyecto está configurado para desplegarse automáticamente en Vercel:

1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente la configuración
3. El sitio estará disponible en minutos

**No se requieren variables de entorno ni configuración adicional.**

### Local

Para probar localmente, simplemente abre `index.html` en tu navegador.

## 📋 Casos de uso

- Descargar videos de una playlist con herramientas externas (yt-dlp, 4K Video Downloader, etc.)
- Crear backups de listas de reproducción
- Compartir listas de videos
- Migrar playlists entre plataformas

## 🛠️ Tecnologías

- HTML5
- CSS3 (Gradientes, animaciones, glassmorphism)
- JavaScript Vanilla (sin dependencias)

## ⚠️ Limitaciones

- Solo funciona con playlists **públicas**
- Requiere que la playlist sea accesible sin iniciar sesión
- No descarga videos, solo extrae URLs

## 📝 Notas

Esta herramienta extrae URLs analizando el HTML público de YouTube. No utiliza la API oficial, por lo que:
- ✅ No requiere API key
- ✅ No tiene límites de cuota
- ⚠️ Puede dejar de funcionar si YouTube cambia su estructura HTML

## 🤝 Uso con otras herramientas

Las URLs extraídas pueden usarse con:
- **yt-dlp**: `yt-dlp -a urls.txt`
- **youtube-dl**: `youtube-dl -a urls.txt`
- **4K Video Downloader**: Importar lista
- **JDownloader**: Agregar URLs

## 📄 Licencia

MIT - Uso libre
