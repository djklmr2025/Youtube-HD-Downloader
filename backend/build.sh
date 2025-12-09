# Build script para Render
# Instala Chrome y ChromeDriver

#!/usr/bin/env bash

# Instalar dependencias de Python
pip install -r requirements.txt

# Instalar Chrome (si no está instalado)
if ! command -v google-chrome &> /dev/null; then
    echo "Instalando Google Chrome..."
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
    apt-get update
    apt-get install -y google-chrome-stable
fi

# Instalar ChromeDriver
if ! command -v chromedriver &> /dev/null; then
    echo "Instalando ChromeDriver..."
    CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)
    wget -q "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VERSION}" -O /tmp/chromedriver_version
    CHROMEDRIVER_VERSION=$(cat /tmp/chromedriver_version)
    wget -q "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" -O /tmp/chromedriver.zip
    unzip -o /tmp/chromedriver.zip -d /usr/local/bin/
    chmod +x /usr/local/bin/chromedriver
fi

echo "Build completado exitosamente!"
