<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BeatVault – YouTube Playlist Manager

This project is a Vite + React application that lets you authenticate with Google OAuth, browse your YouTube playlists, and export playlist data.

## Setup

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your Google OAuth client ID in a `.env.local` file (see [`.env.example`](.env.example) for the expected variables).
3. Start the development server:
   ```bash
   npm run dev
   ```

The app uses `VITE_GOOGLE_CLIENT_ID` for the OAuth flow. A preconfigured client ID is provided in `.env.example`; replace it with your own if needed. No client secret is required on the frontend.

## Deploying to Vercel

1. Create a new Vercel project and import this repository.
2. Add the environment variable `VITE_GOOGLE_CLIENT_ID` in the project settings (and optionally `NEXT_PUBLIC_GOOGLE_CLIENT_ID` for compatibility).
3. Set the **Framework Preset** to **Vite**, and keep the default build command `npm run build` and output directory `dist`.
4. For local previews or redeploys, ensure the same environment variables are defined in the Vercel environment you target (Development/Preview/Production).

## Deploying to Render (Static Site)

1. Create a **Static Site** on Render and point it to this repository.
2. Set the build command to `npm run build` and the publish directory to `dist`.
3. Add the environment variable `VITE_GOOGLE_CLIENT_ID` under **Environment** (and optionally `NEXT_PUBLIC_GOOGLE_CLIENT_ID`).
4. If you prefer a Docker-based deploy, keep the same variables in your Render service environment and expose the built `dist` directory via your web server configuration.

## OAuth notes

* Only the OAuth **Client ID** is needed in the frontend; do **not** expose client secrets.
* In the Google Cloud Console, enable the **YouTube Data API v3** and add your deployed domain to the **Authorized JavaScript origins** list.
