from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import logging
from datetime import datetime
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Permitir requests desde cualquier dominio

class PlaylistExtractor:
    """Extractor de playlists usando Selenium"""
    
    def __init__(self):
        self.videos = []
        self.duplicates = set()
        
    def _init_driver(self):
        """Inicializa Chrome en modo headless"""
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-software-rasterizer')
        options.add_argument('--disable-extensions')
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        # Para Render/Railway
        options.binary_location = os.environ.get('GOOGLE_CHROME_BIN', '/usr/bin/google-chrome')
        
        driver = webdriver.Chrome(options=options)
        return driver
    
    def extract(self, playlist_url, max_scrolls=20):
        """
        Extrae todos los videos de una playlist
        
        Args:
            playlist_url: URL de la playlist
            max_scrolls: Máximo de scrolls (para evitar loops infinitos)
        
        Returns:
            dict con videos y metadata
        """
        logger.info(f"Iniciando extracción de: {playlist_url}")
        
        driver = None
        try:
            driver = self._init_driver()
            driver.get(playlist_url)
            logger.info("Página cargada, esperando contenido...")
            time.sleep(3)
            
            # Scroll infinito
            last_height = driver.execute_script("return document.documentElement.scrollHeight")
            scroll_count = 0
            no_new_count = 0
            
            while scroll_count < max_scrolls:
                # Contar videos actuales
                items = driver.find_elements(By.CSS_SELECTOR, "ytd-playlist-video-renderer")
                current_count = len(items)
                
                logger.info(f"Scroll {scroll_count + 1}: {current_count} videos")
                
                # Scroll
                driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
                time.sleep(2)
                
                # Verificar nueva altura
                new_height = driver.execute_script("return document.documentElement.scrollHeight")
                
                if new_height == last_height:
                    no_new_count += 1
                    if no_new_count >= 5:
                        logger.info("No hay más videos para cargar")
                        break
                else:
                    no_new_count = 0
                
                last_height = new_height
                scroll_count += 1
            
            # Extraer información
            items = driver.find_elements(By.CSS_SELECTOR, "ytd-playlist-video-renderer")
            logger.info(f"Extrayendo información de {len(items)} videos...")
            
            for idx, item in enumerate(items, 1):
                try:
                    title_elem = item.find_element(By.ID, "video-title")
                    title = title_elem.text.strip()
                    url = title_elem.get_attribute("href")
                    video_id = url.split('v=')[1].split('&')[0] if 'v=' in url else ""
                    
                    if video_id and video_id not in self.duplicates:
                        self.videos.append({
                            "index": idx,
                            "title": title,
                            "video_id": video_id,
                            "url": f"https://www.youtube.com/watch?v={video_id}",
                            "extracted_at": datetime.now().isoformat()
                        })
                        self.duplicates.add(video_id)
                except Exception as e:
                    logger.error(f"Error extrayendo video {idx}: {e}")
                    continue
            
            logger.info(f"Extracción completada: {len(self.videos)} videos únicos")
            
            return {
                "success": True,
                "total_videos": len(self.videos),
                "videos": self.videos,
                "metadata": {
                    "extraction_date": datetime.now().isoformat(),
                    "duplicates_removed": len(self.duplicates) - len(self.videos)
                }
            }
            
        except Exception as e:
            logger.error(f"Error durante extracción: {e}")
            return {
                "success": False,
                "error": str(e),
                "total_videos": 0,
                "videos": []
            }
        finally:
            if driver:
                driver.quit()

@app.route('/')
def home():
    """Endpoint de bienvenida"""
    return jsonify({
        "service": "YouTube Playlist Extractor API",
        "version": "1.0.0",
        "endpoints": {
            "/extract": "POST - Extrae videos de una playlist",
            "/health": "GET - Verifica el estado del servicio"
        }
    })

@app.route('/health')
def health():
    """Health check para Render"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/extract', methods=['POST'])
def extract_playlist():
    """
    Endpoint principal para extraer playlists
    
    Body JSON:
    {
        "url": "https://www.youtube.com/playlist?list=..."
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                "success": False,
                "error": "URL de playlist requerida"
            }), 400
        
        playlist_url = data['url']
        
        # Validar URL
        if 'youtube.com/playlist' not in playlist_url or 'list=' not in playlist_url:
            return jsonify({
                "success": False,
                "error": "URL de playlist inválida"
            }), 400
        
        logger.info(f"Request recibido para: {playlist_url}")
        
        # Extraer playlist
        extractor = PlaylistExtractor()
        result = extractor.extract(playlist_url)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
            
    except Exception as e:
        logger.error(f"Error en endpoint /extract: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
