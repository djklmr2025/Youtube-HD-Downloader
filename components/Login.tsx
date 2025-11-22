import React, { useState } from 'react';
import { Settings, AlertCircle, Disc } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleTokenResponse } from '../types';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
  clientId: string;
  setClientId: (id: string) => void;
}

// Internal component that uses the hook. 
// This must ONLY be rendered when GoogleOAuthProvider is present in the parent tree.
const GoogleSignInButton: React.FC<{
  onSuccess: (tokenResponse: GoogleTokenResponse) => void;
  onError: () => void;
}> = ({ onSuccess, onError }) => {
  const login = useGoogleLogin({
    onSuccess,
    onError,
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile',
  });

  return (
    <button
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in with Google
    </button>
  );
};

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, clientId, setClientId }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(!clientId);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccessWrapper = (tokenResponse: GoogleTokenResponse) => {
    onLoginSuccess(tokenResponse.access_token);
  };

  const handleLoginError = () => {
    setError('Login Failed. Please check your Client ID and Allowed Origins in Google Cloud Console.');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 blur-lg opacity-50 rounded-full"></div>
              <div className="relative bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
                 <Disc className="w-12 h-12 text-brand-400 animate-spin-slow" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">BeatVault</h1>
          <p className="text-slate-400">Curate. Export. Archive.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {/* 
             Conditional Rendering:
             Only render GoogleSignInButton if clientId exists.
             If it doesn't exist, the parent App component won't have the Provider,
             so rendering the button would crash the app.
          */}
          {clientId ? (
            <GoogleSignInButton onSuccess={handleLoginSuccessWrapper} onError={handleLoginError} />
          ) : (
            <button
              onClick={() => setIsConfigOpen(true)}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 text-slate-300 font-semibold py-3.5 px-6 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <Settings className="w-5 h-5" />
              Setup Client ID
            </button>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
             <button 
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="text-slate-500 text-sm hover:text-slate-300 flex items-center justify-center gap-2 mx-auto transition-colors"
             >
               <Settings className="w-4 h-4" />
               {isConfigOpen ? 'Close Configuration' : 'Configure Client ID'}
             </button>
          </div>
        </div>

        {isConfigOpen && (
          <div className="mt-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 animate-in fade-in slide-in-from-top-4">
             <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Google Client ID</label>
             <input 
               type="text" 
               value={clientId}
               onChange={(e) => setClientId(e.target.value)}
               placeholder="xxxx-xxxx.apps.googleusercontent.com"
               className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
             />
             <p className="text-xs text-slate-500 mt-2">
               Required for OAuth2. Create one in Google Cloud Console enabling "YouTube Data API v3".
             </p>
          </div>
        )}
      </div>
    </div>
  );
};