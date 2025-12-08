# BeatVault - YouTube Playlist Downloader

Una aplicación moderna para gestionar y descargar playlists de YouTube.

## 🚀 Despliegue en Vercel

### Paso 1: Configurar Variables de Entorno

Después de importar el proyecto en Vercel, necesitas configurar las siguientes variables de entorno:

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Environment Variables**
3. Agrega la siguiente variable:

```
VITE_GOOGLE_CLIENT_ID=tu-google-client-id-aqui
```

### Paso 2: Obtener Google Client ID

Para obtener un Google Client ID:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **YouTube Data API v3**
4. Ve a **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configura el tipo de aplicación como **Web application**
6. En **Authorized JavaScript origins**, agrega:
   - `http://localhost:3000` (para desarrollo local)
   - `https://tu-dominio.vercel.app` (tu dominio de Vercel)
7. En **Authorized redirect URIs**, agrega:
   - `http://localhost:3000`
   - `https://tu-dominio.vercel.app`
8. Copia el **Client ID** generado

### Paso 3: Redesplegar

Después de agregar las variables de entorno:

1. Ve a **Deployments** en Vercel
2. Haz clic en los tres puntos del último deployment
3. Selecciona **Redeploy**

## 🛠️ Desarrollo Local

### Instalación

```bash
npm install
```

### Configuración

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` y agrega tu Google Client ID:
```
VITE_GOOGLE_CLIENT_ID=tu-google-client-id-aqui
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para producción

```bash
npm run build
```

### Preview del build

```bash
npm run preview
```

## 📋 Características

- ✅ Autenticación con Google OAuth
- ✅ Visualización de playlists de YouTube
- ✅ Descarga de información de videos
- ✅ Exportación de datos
- ✅ Interfaz moderna y responsive
- ✅ Modo oscuro

## 🔧 Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS
- YouTube Data API v3
- Google OAuth

## 📝 Notas Importantes

- La aplicación requiere un Google Client ID válido para funcionar
- Asegúrate de que el dominio de Vercel esté autorizado en Google Cloud Console
- Las variables de entorno deben estar configuradas en Vercel para que la aplicación funcione en producción

## 🐛 Solución de Problemas

### Pantalla negra en Vercel

Si ves una pantalla negra:
1. Verifica que `VITE_GOOGLE_CLIENT_ID` esté configurado en Vercel
2. Asegúrate de que el dominio de Vercel esté autorizado en Google Cloud Console
3. Revisa los logs de deployment en Vercel
4. Verifica la consola del navegador para errores

### Error de OAuth

Si obtienes errores de OAuth:
1. Verifica que el Client ID sea correcto
2. Asegúrate de que el dominio esté en la lista de orígenes autorizados
3. Limpia el caché del navegador y vuelve a intentar

## 📄 Licencia

MIT
