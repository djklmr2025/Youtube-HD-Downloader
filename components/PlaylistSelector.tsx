import React from 'react';
import { YouTubePlaylist } from '../types';
import { ListMusic, PlaySquare, Lock } from 'lucide-react';

interface PlaylistSelectorProps {
  playlists: YouTubePlaylist[];
  onSelect: (playlist: YouTubePlaylist) => void;
}

export const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ playlists, onSelect }) => {
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <ListMusic className="w-16 h-16 mb-4 opacity-20" />
        <p>No playlists found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <ListMusic className="w-6 h-6 text-brand-400" />
        Select a Playlist
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => {
           const thumbnail = playlist.snippet.thumbnails.high?.url || playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default?.url;
           
           return (
            <button
              key={playlist.id}
              onClick={() => onSelect(playlist)}
              className="group relative flex flex-col text-left bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-slate-800">
                {thumbnail ? (
                  <img 
                    src={thumbnail} 
                    alt={playlist.snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlaySquare className="w-12 h-12 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent opacity-60"></div>
                
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                  <ListMusic className="w-3 h-3" />
                  {playlist.contentDetails.itemCount}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col w-full">
                <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-brand-300 transition-colors">
                  {playlist.snippet.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2 flex-1">
                  {playlist.snippet.description || "No description"}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{new Date(playlist.snippet.publishedAt).toLocaleDateString()}</span>
                  {playlist.snippet.channelTitle && (
                     <span className="bg-slate-800 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                       {playlist.snippet.channelTitle}
                     </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
