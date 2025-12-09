#!/usr/bin/env python3
"""
YouTube Playlist Extractor - 100% Completo
Extrae TODOS los videos de una playlist usando Selenium
No requiere API Key
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
import sys

def extract_playlist(playlist_url, expected_videos=None):
    """
    Extrae todos los videos de una playlist de YouTube
    
    Args:
        playlist_url: URL de la playlist
        expected_videos: Número esperado de videos (opcional)
    
    Returns:
        Lista de diccionarios con información de cada video
    """
    
    print(f"🎵 Iniciando extracción de playlist...")
    print(f"📍 URL: {playlist_url}\n")
    
    # Configurar Chrome en modo headless (sin ventana)
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--log-level=3')  # Suprimir logs
    
    # Iniciar driver
    print("🚀 Iniciando navegador...")
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Navegar a la playlist
        driver.get(playlist_url)
        print("⏳ Cargando página inicial...")
        time.sleep(3)
        
        # Scroll infinito para cargar todos los videos
        print("📜 Ejecutando scroll infinito...\n")
        last_height = driver.execute_script("return document.documentElement.scrollHeight")
        scroll_count = 0
        videos_loaded = 0
        
        while True:
            scroll_count += 1
            
            # Hacer scroll
            driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
            time.sleep(2)
            
            # Contar videos actuales
            items = driver.find_elements(By.CSS_SELECTOR, "ytd-playlist-video-renderer")
            videos_loaded = len(items)
            
            print(f"   Scroll {scroll_count}: {videos_loaded} videos cargados", end='\r')
            
            # Verificar si llegamos al final
            new_height = driver.execute_script("return document.documentElement.scrollHeight")
            
            # Condiciones de parada
            if new_height == last_height:
                print(f"\n✅ Scroll completo - No hay más videos para cargar")
                break
            
            if expected_videos and videos_loaded >= expected_videos:
                print(f"\n✅ Se alcanzó el número esperado de videos ({expected_videos})")
                break
            
            last_height = new_height
        
        print(f"\n📊 Extrayendo información de {videos_loaded} videos...\n")
        
        # Extraer información de cada video
        videos = []
        items = driver.find_elements(By.CSS_SELECTOR, "ytd-playlist-video-renderer")
        
        for idx, item in enumerate(items, 1):
            try:
                # Extraer título
                title_element = item.find_element(By.ID, "video-title")
                title = title_element.text.strip()
                
                # Extraer URL
                url = title_element.get_attribute("href")
                
                # Extraer video ID
                video_id = url.split("v=")[1].split("&")[0] if "v=" in url else ""
                
                videos.append({
                    "index": idx,
                    "title": title,
                    "video_id": video_id,
                    "url": url,
                    "url_simple": f"https://www.youtube.com/watch?v={video_id}"
                })
                
                print(f"   ✓ Video {idx}: {title[:50]}...")
                
            except Exception as e:
                print(f"   ✗ Error en video {idx}: {str(e)}")
                continue
        
        print(f"\n✅ Extracción completada: {len(videos)} videos\n")
        return videos
        
    finally:
        driver.quit()
        print("🔒 Navegador cerrado")

def save_results(videos, playlist_url):
    """Guarda los resultados en múltiples formatos"""
    
    # Extraer ID de playlist
    playlist_id = playlist_url.split("list=")[1].split("&")[0] if "list=" in playlist_url else "playlist"
    
    # 1. Guardar JSON
    json_file = f"playlist_{playlist_id}.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump({
            "playlist_url": playlist_url,
            "total_videos": len(videos),
            "videos": videos
        }, f, ensure_ascii=False, indent=2)
    print(f"💾 JSON guardado: {json_file}")
    
    # 2. Guardar TXT (solo URLs)
    txt_file = f"playlist_{playlist_id}_urls.txt"
    with open(txt_file, "w", encoding="utf-8") as f:
        for video in videos:
            f.write(f"{video['url_simple']}\n")
    print(f"💾 TXT guardado: {txt_file}")
    
    # 3. Guardar CSV
    csv_file = f"playlist_{playlist_id}.csv"
    with open(csv_file, "w", encoding="utf-8") as f:
        f.write("Index,Title,Video ID,URL\n")
        for video in videos:
            # Escapar comillas en el título
            title = video['title'].replace('"', '""')
            f.write(f'{video["index"]},"{title}",{video["video_id"]},{video["url_simple"]}\n')
    print(f"💾 CSV guardado: {csv_file}")
    
    # 4. Crear archivo DLC para JDownloader
    dlc_file = f"playlist_{playlist_id}.dlc"
    dlc_content = f"""<dlc>
<header>
<generator>YouTube Playlist Extractor</generator>
<tribute>Created with Python + Selenium</tribute>
</header>
<content>
<package name="YouTube Playlist {playlist_id}" passwords="" comment="">
"""
    for video in videos:
        import base64
        url_encoded = base64.b64encode(video['url_simple'].encode()).decode()
        dlc_content += f'<file><url>{url_encoded}</url></file>\n'
    
    dlc_content += """</package>
</content>
</dlc>"""
    
    with open(dlc_file, "w", encoding="utf-8") as f:
        f.write(dlc_content)
    print(f"💾 DLC guardado: {dlc_file}")

if __name__ == "__main__":
    # URL de la playlist (puedes cambiarla aquí o pasarla como argumento)
    if len(sys.argv) > 1:
        playlist_url = sys.argv[1]
    else:
        # URL por defecto (tu playlist de 119 videos)
        playlist_url = "https://www.youtube.com/playlist?list=PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo"
    
    # Número esperado de videos (opcional)
    expected_videos = 119 if "PLCYBQp7vbvBHqtaozeouLD9ek-GuiMcjo" in playlist_url else None
    
    print("=" * 60)
    print("🎬 YOUTUBE PLAYLIST EXTRACTOR - 100% COMPLETO")
    print("=" * 60)
    print()
    
    try:
        # Extraer videos
        videos = extract_playlist(playlist_url, expected_videos)
        
        if videos:
            # Guardar resultados
            print("\n" + "=" * 60)
            print("💾 GUARDANDO RESULTADOS")
            print("=" * 60)
            print()
            save_results(videos, playlist_url)
            
            print("\n" + "=" * 60)
            print(f"✅ ¡ÉXITO! {len(videos)} videos extraídos y guardados")
            print("=" * 60)
        else:
            print("\n❌ No se encontraron videos")
            
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
