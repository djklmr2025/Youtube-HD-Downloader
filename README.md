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
