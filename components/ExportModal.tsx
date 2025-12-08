import React, { useEffect, useState } from 'react';
import { YouTubePlaylistItem } from '../types';
import { X, Download, Copy, Check, Terminal, Video, Music, AlertCircle } from 'lucide-react';

interface ExportModalProps {
  items: YouTubePlaylistItem[];
  onClose: () => void;
}

const PYTHON_SCRIPT = `#!/usr/bin/env python3
"""
YouTube Playlist Downloader - Local Script
Use with the exported playlist_urls.txt file.
Requires: yt-dlp and ffmpeg (for merging best video+audio or mp3 conversion)
"""
import os
import sys
import subprocess
import shutil

def check_ffmpeg():
    if not shutil.which("ffmpeg"):
        print("\\n⚠️  WARNING: FFmpeg not found!")
        print("   - Video mode: Audio might be separated from video.")
        print("   - Audio mode: MP3 conversion will fail.")
        print("   👉 Install FFmpeg: https://ffmpeg.org/download.html\\n")

def install_dependencies():
    print("Checking python dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "yt-dlp"])

def download_videos(file_path, audio_only=False):
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found!")
        return

    print(f"Reading URLs from {file_path}...")
    check_ffmpeg()
    
    # yt-dlp base command
    cmd = ["yt-dlp", "-a", file_path, "--ignore-errors"]
    
    if audio_only:
        # High quality MP3 extraction for DJs
        cmd.extend([
            "-x", "--audio-format", "mp3", 
            "--audio-quality", "0", # Best quality
            "-o", "%(title)s.%(ext)s"
        ])
        print("Starting Audio Download (High Quality MP3)...")
    else:
        # Best video + audio
        cmd.extend([
            "-f", "bestvideo+bestaudio/best",
            "--merge-output-format", "mp4",
            "-o", "%(title)s.%(ext)s"
        ])
        print("Starting Video Download (Best Quality MP4)...")

    try:
        subprocess.run(cmd, check=True)
        print("\\n✅ Download complete!")
    except subprocess.CalledProcessError as e:
        print(f"\\n❌ Error occurred: {e}")
    except FileNotFoundError:
        print("\\n❌ yt-dlp not found. Installing...")
        install_dependencies()
        download_videos(file_path, audio_only)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python download.py <playlist_file.txt> [--audio-only]")
        sys.exit(1)
    
    txt_file = sys.argv[1]
    audio_mode = "--audio-only" in sys.argv or "-a" in sys.argv
    
    download_videos(txt_file, audio_mode)
`;

export const ExportModal: React.FC<ExportModalProps> = ({ items, onClose }) => {
  const [hasCopied, setHasCopied] = useState(false);

  // Generate blob URL for playlist
  const fileUrl = React.useMemo(() => {
    const urls = items.map(item => `https://www.youtube.com/watch?v=${item.contentDetails?.videoId}`).join('\n');
    const blob = new Blob([urls], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  }, [items]);

  // Generate blob URL for Python script
  const scriptUrl = React.useMemo(() => {
    const blob = new Blob([PYTHON_SCRIPT], { type: 'text/x-python' });
    return URL.createObjectURL(blob);
  }, []);

  const copyScript = () => {
    navigator.clipboard.writeText(PYTHON_SCRIPT);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900">
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to Download</h2>
            <p className="text-slate-400 mt-1">{items.length} items selected</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Step 1 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-semibold text-white">Save your playlist file</h3>
            </div>
            <div className="ml-12">
              <a 
                href={fileUrl} 
                download="playlist_urls.txt"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download playlist_urls.txt
              </a>
              <p className="mt-2 text-sm text-slate-500">Contains direct links to all selected videos.</p>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-semibold text-white">Get the Downloader Script</h3>
            </div>
            <div className="ml-12">
               <div className="flex flex-wrap gap-3 mb-4">
                  <a 
                    href={scriptUrl} 
                    download="download.py"
                    className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download download.py
                  </a>
                  <button 
                    onClick={copyScript}
                    className="inline-flex items-center gap-2 bg-slate-800 text-brand-300 px-4 py-2 rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors text-sm font-medium"
                  >
                    {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
               </div>
               
               <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 text-sm mb-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>This script uses <strong>yt-dlp</strong>. For best results (merging video+audio or converting to MP3), ensure you have <strong>FFmpeg</strong> installed on your system.</p>
               </div>

               <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 relative group">
                 <pre className="text-xs text-slate-400 font-mono overflow-x-auto h-32 custom-scrollbar">
                   {PYTHON_SCRIPT}
                 </pre>
               </div>
            </div>
          </section>

          {/* Step 3 */}
          <section>
             <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">3</div>
              <h3 className="text-lg font-semibold text-white">Run locally</h3>
            </div>
            <div className="ml-12">
               {/* Dependency Install */}
               <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-2 font-medium">First time setup:</p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 flex items-center gap-2">
                    <span className="text-slate-600">$</span> pip install yt-dlp
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Video Option */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-brand-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="w-5 h-5 text-brand-400" />
                      <span className="font-semibold text-white">Download Video</span>
                      <span className="bg-slate-700 text-xs px-1.5 py-0.5 rounded text-slate-300">MP4</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Downloads best available video and audio quality.</p>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-xs text-brand-200 break-all select-all cursor-pointer">
                      python download.py playlist_urls.txt
                    </div>
                  </div>

                  {/* Audio Option */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-fuchsia-500/30 transition-colors">
                     <div className="flex items-center gap-2 mb-3">
                      <Music className="w-5 h-5 text-fuchsia-400" />
                      <span className="font-semibold text-white">Download Audio</span>
                      <span className="bg-slate-700 text-xs px-1.5 py-0.5 rounded text-slate-300">MP3</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Extracts audio only (DJ Mode).</p>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-xs text-fuchsia-200 break-all select-all cursor-pointer">
                      python download.py playlist_urls.txt --audio-only
                    </div>
                  </div>
               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
