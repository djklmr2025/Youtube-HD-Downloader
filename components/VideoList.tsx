import React, { useState, useMemo } from 'react';
import { YouTubePlaylistItem, YouTubePlaylist } from '../types';
import { ArrowLeft, CheckSquare, Square, Filter, Download, Search, Video } from 'lucide-react';

interface VideoListProps {
  playlist: YouTubePlaylist;
  items: YouTubePlaylistItem[];
  onBack: () => void;
  onExport: (selectedItems: YouTubePlaylistItem[]) => void;
}

export const VideoList: React.FC<VideoListProps> = ({ playlist, items, onBack, onExport }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(items.map(i => i.id)));
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.snippet.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  };

  const handleExport = () => {
    const selected = items.filter(i => selectedIds.has(i.id));
    onExport(selected);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header Toolbar */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 p-4 z-20">
        <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-white line-clamp-1">{playlist.snippet.title}</h2>
                        <p className="text-sm text-slate-400">{items.length} videos available</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        disabled={selectedIds.size === 0}
                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-brand-500/20"
                    >
                        <Download className="w-4 h-4" />
                        Export {selectedIds.size} Videos
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Filter videos..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                    />
                </div>
                <button 
                    onClick={toggleAll}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3 py-2"
                >
                    {selectedIds.size === filteredItems.length ? <CheckSquare className="w-4 h-4 text-brand-400" /> : <Square className="w-4 h-4" />}
                    Select All
                </button>
            </div>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto space-y-2">
            {filteredItems.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    No videos found matching your search.
                </div>
            ) : (
                filteredItems.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => toggleSelection(item.id)}
                        className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer group ${
                            selectedIds.has(item.id) 
                            ? 'bg-brand-500/10 border-brand-500/30' 
                            : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                        }`}
                    >
                        <div className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                             selectedIds.has(item.id) ? 'bg-brand-500 border-brand-500' : 'border-slate-600 group-hover:border-slate-400'
                        }`}>
                            {selectedIds.has(item.id) && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                        </div>

                        <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                             {item.snippet.thumbnails.medium ? (
                                <img src={item.snippet.thumbnails.medium.url} className="w-full h-full object-cover" alt="" />
                             ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <Video className="w-8 h-8 text-slate-700" />
                                </div>
                             )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className={`text-sm font-medium truncate ${selectedIds.has(item.id) ? 'text-brand-300' : 'text-white'}`}>
                                {item.snippet.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                                {item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle}
                            </p>
                            <div className="text-xs text-slate-600 mt-1 font-mono">
                                https://youtu.be/{contentDetails.130
                              ?.videoId}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
