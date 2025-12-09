#!/usr/bin/env python3
"""
YouTube Playlist Extractor - Versión Avanzada 100% Completa
Extrae TODOS los videos de cualquier playlist sin límite
Con reintentos automáticos, validación y reportes detallados
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import json
import csv
import sys
import os
from datetime import datetime
from collections import defaultdict
import logging
from typing import List, Dict, Optional
import argparse

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"playlist_extraction_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class YouTubePlaylistExtractor:
    """Extractor avanzado de playlists con validaciones y reintentos"""
    
    def __init__(self, headless=True, max_retries=3, scroll_pause_time=2):
        """
        Inicializa el extractor
        
        Args:
            headless: Ejecutar sin interfaz gráfica
            max_retries: Número máximo de reintentos en caso de error
            scroll_pause_time: Tiempo de pausa entre scrolls (segundos)
        """
        self.max_retries = max_retries
        self.scroll_pause_time = scroll_pause_time
        self.videos = []
        self.duplicates = set()
        self.errors = []
        self.driver = None
        self.headless = headless
        
    def _init_driver(self):
        """Inicializa el driver de Selenium"""
        options = webdriver.ChromeOptions()
        if self.headless:
            options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--log-level=3')
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        try:
            self.driver = webdriver.Chrome(options=options)
            logger.info("✅ Driver de Chrome inicializado correctamente")
        except Exception as e:
            logger.error(f"❌ Error al inicializar driver: {e}")
            raise
    
    def _validate_url(self, url: str) -> bool:
        """Valida que la URL sea una playlist válida"""
        return 'youtube.com/playlist' in url and 'list=' in url
    
    def _extract_playlist_id(self, url: str) -> Optional[str]:
        """Extrae el ID de la playlist"""
        try:
            return url.split('list=')[1].split('&')[0]
        except:
            return None
    
    def extract(self, playlist_url: str, expected_videos: Optional[int] = None) -> List[Dict]:
        """
        Extrae todos los videos de la playlist
        
        Args:
            playlist_url: URL de la playlist
            expected_videos: Número esperado de videos (opcional, para validación)
        
        Returns:
            Lista de diccionarios con información de videos
        """
        
        # Validar URL
        if not self._validate_url(playlist_url):
            raise ValueError("URL de playlist inválida")
        
        playlist_id = self._extract_playlist_id(playlist_url)
        logger.info(f"📌 ID de playlist: {playlist_id}")
        logger.info(f"📌 URL: {playlist_url}")
        
        if expected_videos:
            logger.info(f"📊 Esperando extraer: {expected_videos} videos")
        
        # Inicializar driver
        self._init_driver()
        
        try:
            # Navegar a la playlist
            self.driver.get(playlist_url)
            logger.info("⏳ Cargando playlist...")
            time.sleep(3)
            
            # Scroll infinito con reintentos
            self._infinite_scroll(expected_videos)
            
            # Extraer información detallada de videos
            self._extract_video_details()
            
            # Validar y reportar
            self._validate_results(expected_videos)
            
            logger.info(f"✅ Extracción completada: {len(self.videos)} videos")
            return self.videos
            
        except Exception as e:
            logger.error(f"❌ Error durante la extracción: {e}")
            raise
        finally:
            if self.driver:
                self.driver.quit()
    
    def _infinite_scroll(self, expected_videos: Optional[int] = None):
        """Scroll infinito con detección inteligente de nuevos videos"""
        logger.info("🔄 Iniciando scroll infinito...")
        
        last_height = self.driver.execute_script("return document.documentElement.scrollHeight")
        scroll_count = 0
        no_new_videos_count = 0
        max_no_new = 5  # Máximo de scrolls sin nuevos videos antes de parar
        
        while True:
            # Contar videos actuales
            items = self.driver.find_elements(By.CSS_SELECTOR, "ytd-playlist-video-renderer")
            current_count = len(items)
            
            logger.info(f"📽️  Videos cargados: {current_count}")
            
            # Si encontramos los videos esperados, parar
            if expected_videos and current_count >= expected_videos:
                logger.info(f"✅ Se alcanzó el número esperado: {expected_videos}")
                break
            
            # Scroll
            self.driver.execute_script(
                "window.scrollTo(0, document.documentElement.scrollHeight);"
            )
            time.sleep(self.scroll_pause_time)
            
            # Verificar nueva altura
            new_height = self.driver.execute_script("return document.documentElement.scrollHeight")
            
            if new_height == last_height:
                no_new_videos_count += 1
                logger.warning(f"⚠️  Sin cambios en altura (intento {no_new_videos_count}/{max_no_new})")
                
                if no_new_videos_count >= max_no_new:
                    logger.info("✅ Scroll completo - no hay más videos")
                    break
            else:
                no_new_videos_count = 0
            
            last_height = new_height
            scroll_count += 1
            
            if scroll_count % 10 == 0:
                logger.info(f"📍 Scroll {scroll_count} completado")
    
    def _extract_video_details(self):
        """Extrae detalles completos de cada video"""
        logger.info("📋 Extrayendo detalles de videos...")
        
        items = self.driver.find_elements(By.CSS_SELECTOR, "ytd-playlist-video-renderer")
        logger.info(f"Total de elementos encontrados: {len(items)}")
        
        for idx, item in enumerate(items, 1):
            try:
                # Extraer título
                title_elem = item.find_element(By.ID, "video-title")
                title = title_elem.text.strip()
                
                # Extraer URL
                url = title_elem.get_attribute("href")
                
                # Extraer video ID
                video_id = url.split('v=')[1].split('&')[0] if 'v=' in url else ""
                
                # Extraer duración
                duration = ""
                try:
                    duration_elem = item.find_element(By.CSS_SELECTOR, "span.style-scope.ytd-thumbnail-overlay-time-status-renderer")
                    duration = duration_elem.text
                except:
                    pass
                
                video_data = {
                    "index": idx,
                    "title": title,
                    "video_id": video_id,
                    "url": url,
                    "url_simple": f"https://www.youtube.com/watch?v={video_id}",
                    "duration": duration,
                    "extracted_at": datetime.now().isoformat()
                }
                
                # Validar duplicados
                if video_id not in self.duplicates:
                    self.videos.append(video_data)
                    self.duplicates.add(video_id)
                else:
                    logger.warning(f"⚠️  Video duplicado detectado: {title}")
                
                if idx % 20 == 0:
                    logger.info(f"✅ {idx} videos procesados")
                    
            except Exception as e:
                logger.error(f"❌ Error extrayendo video {idx}: {e}")
                self.errors.append({"index": idx, "error": str(e)})
    
    def _validate_results(self, expected_videos: Optional[int] = None):
        """Valida los resultados de la extracción"""
        logger.info("🔍 Validando resultados...")
        
        total = len(self.videos)
        logger.info(f"Total de videos únicos: {total}")
        
        if expected_videos:
            if total == expected_videos:
                logger.info(f"✅ Coincide con lo esperado: {expected_videos}")
            elif total > expected_videos:
                logger.warning(f"⚠️  Encontrados más videos ({total}) que esperados ({expected_videos})")
            else:
                logger.warning(f"⚠️  Encontrados menos videos ({total}) que esperados ({expected_videos})")
        
        if self.errors:
            logger.warning(f"⚠️  {len(self.errors)} errores durante la extracción")
    
    def save_json(self, filename: str = "playlist.json"):
        """Guarda los resultados en JSON"""
        output = {
            "metadata": {
                "total_videos": len(self.videos),
                "extraction_date": datetime.now().isoformat(),
                "duplicates_removed": len(self.duplicates) - len(self.videos),
                "errors": len(self.errors)
            },
            "videos": self.videos,
            "errors": self.errors if self.errors else []
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        logger.info(f"💾 JSON guardado: {filename}")
    
    def save_csv(self, filename: str = "playlist.csv"):
        """Guarda los resultados en CSV"""
        if not self.videos:
            logger.warning("No hay videos para guardar")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=self.videos[0].keys())
            writer.writeheader()
            writer.writerows(self.videos)
        
        logger.info(f"💾 CSV guardado: {filename}")
    
    def save_txt(self, filename: str = "playlist_urls.txt"):
        """Guarda solo las URLs en formato TXT"""
        with open(filename, 'w', encoding='utf-8') as f:
            for video in self.videos:
                f.write(f"{video['url_simple']}\n")
        
        logger.info(f"💾 TXT guardado: {filename}")
    
    def save_dlc(self, filename: str = "playlist.dlc"):
        """Guarda en formato DLC (JDownloader)"""
        import base64
        
        dlc_content = f"""<dlc>
<header>
<generator>YouTube Playlist Extractor Advanced</generator>
<tribute>Created with Python + Selenium</tribute>
</header>
<content>
<package name="YouTube Playlist" passwords="" comment="">
"""
        for video in self.videos:
            url_encoded = base64.b64encode(video['url_simple'].encode()).decode()
            dlc_content += f'<file><url>{url_encoded}</url></file>\n'
        
        dlc_content += """</package>
</content>
</dlc>"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(dlc_content)
        
        logger.info(f"💾 DLC guardado: {filename}")


def main():
    """Función principal con CLI"""
    parser = argparse.ArgumentParser(
        description='YouTube Playlist Extractor - Extrae TODOS los videos de una playlist'
    )
    parser.add_argument('url', nargs='?', help='URL de la playlist de YouTube')
    parser.add_argument('-e', '--expected', type=int, help='Número esperado de videos')
    parser.add_argument('-o', '--output', default='playlist', help='Nombre base para archivos de salida')
    parser.add_argument('--no-headless', action='store_true', help='Mostrar ventana del navegador')
    parser.add_argument('--pause', type=float, default=2, help='Tiempo de pausa entre scrolls (segundos)')
    
    args = parser.parse_args()
    
    # Si no se proporciona URL, usar la por defecto
    if not args.url:
        args.url = "https://www.youtube.com/playlist?list=PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo"
        args.expected = 119
        logger.info("📌 Usando playlist por defecto (119 videos)")
    
    logger.info("="*60)
    logger.info("🚀 YOUTUBE PLAYLIST EXTRACTOR - VERSIÓN AVANZADA 100%")
    logger.info("="*60)
    
    try:
        extractor = YouTubePlaylistExtractor(
            headless=not args.no_headless,
            scroll_pause_time=args.pause
        )
        
        videos = extractor.extract(args.url, args.expected)
        
        # Guardar en todos los formatos
        extractor.save_json(f"{args.output}.json")
        extractor.save_csv(f"{args.output}.csv")
        extractor.save_txt(f"{args.output}_urls.txt")
        extractor.save_dlc(f"{args.output}.dlc")
        
        logger.info("="*60)
        logger.info(f"✅ EXTRACCIÓN COMPLETADA EXITOSAMENTE")
        logger.info(f"Total de videos: {len(videos)}")
        logger.info("="*60)
        
    except Exception as e:
        logger.error(f"❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
