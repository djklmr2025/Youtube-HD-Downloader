import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { Login } from './components/Login';
import { PlaylistSelector } from './components/PlaylistSelector';
import { VideoList } from './components/VideoList';
import { ExportModal } from './components/ExportModal';
import { YouTubePlaylist, YouTubePlaylistItem, UserProfile } from './types';
import { fetchPlaylists, fetchPlaylistItems, fetchUserProfile } from './services/youtubeService';
import { Loader2, LogOut, User } from 'lucide-react';

const CLIENT_ID_STORAGE_KEY = 'beatvault_client_id';

// Main Application Content
// This component handles the authenticated experience.
const AppContent: React.FC<{ 
  clientId: string, 
  setClientId: (id: string) => void 
}> = ({ clientId, setClientId }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylist | null>(null);
  const [playlistItems, setPlaylistItems] = useState<YouTubePlaylistItem[]>([]);
  const [itemsToExport, setItemsToExport] = useState<YouTubePlaylistItem[] | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup token on unmount or if invalid
  useEffect(() => {
    if (!token) {
      setUser(null);
      setPlaylists([]);
      setSelectedPlaylist(null);
    }
  }, [token]);

  const handleLoginSuccess = async (accessToken: string) => {
    setToken(accessToken);
    setLoading(true);
    setError(null);
    try {
      const [userProfile, userPlaylists] = await Promise.all([
        fetchUserProfile(accessToken),
        fetchPlaylists(accessToken)
      ]);
      setUser(userProfile);
      setPlaylists(userPlaylists);
    } catch (err) {
      setError('Failed to load profile or playlists.');
      console.error(err);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistSelect = async (playlist: YouTubePlaylist) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const items = await fetchPlaylistItems(token, playlist.id);
      setPlaylistItems(items);
      setSelectedPlaylist(playlist);
    } catch (err) {
      setError('Failed to load playlist videos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setToken(null);
    setUser(null);
    setSelectedPlaylist(null);
    setPlaylists([]);
  };

  // Render Login screen if not authenticated
  if (!token) {
    return (
       <Login onLoginSuccess={handleLoginSuccess} clientId={clientId} setClientId={setClientId} />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white">
      {/* Navbar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
            <span className="font-bold">B</span>
          </div>
          <span className="font-bold text-lg tracking-tight">BeatVault</span>
        </div>
        
        <div className="flex items-center gap-4">
           {user && (
             <div className="flex items-center gap-3 bg-slate-800 rounded-full pl-1 pr-4 py-1 border border-slate-700">
               {user.picture ? (
                 <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
               ) : (
                 <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center"><User className="w-3 h-3"/></div>
               )}
               <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate">{user.name}</span>
             </div>
           )}
           <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
           >
             <LogOut className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400 animate-pulse">Syncing with YouTube...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl z-50 flex items-center gap-3 max-w-md">
             <p>{error}</p>
             <button onClick={() => setError(null)} className="underline text-sm">Dismiss</button>
          </div>
        )}

        {selectedPlaylist ? (
          <VideoList 
            playlist={selectedPlaylist}
            items={playlistItems}
            onBack={() => setSelectedPlaylist(null)}
            onExport={(items) => setItemsToExport(items)}
          />
        ) : (
          <div className="h-full overflow-y-auto">
             <PlaylistSelector 
              playlists={playlists} 
              onSelect={handlePlaylistSelect} 
             />
          </div>
        )}
      </div>

      {itemsToExport && (
        <ExportModal 
          items={itemsToExport}
          onClose={() => setItemsToExport(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  const [clientId, setClientId] = useState<string>(() => {
    return localStorage.getItem(CLIENT_ID_STORAGE_KEY) || '';
  });

  const updateClientId = (id: string) => {
    setClientId(id);
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
  };

  // If we don't have a Client ID, we cannot initialize the GoogleOAuthProvider.
  // In this state, we render the AppContent (which renders Login).
  // The Login component detects the missing ID and shows the configuration UI *without* 
  // attempting to use the OAuth hooks, preventing the "Provider missing" error.
  if (!clientId) {
     return <AppContent clientId="" setClientId={updateClientId} />
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppContent clientId={clientId} setClientId={updateClientId} />
    </GoogleOAuthProvider>
  );
}