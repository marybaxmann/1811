FROM python:3.12-slim

# Instala dependencias del sistema y Node.js
RUN apt-get update \
    && apt-get install -y curl ca-certificates build-essential gnupg --no-install-recommends \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia package.json del frontend para instalar dependencias de frontend primero (cache layer)
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci --silent

# Copia requirements y instala dependencias Python
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copia todo el proyecto
COPY . .

# Construye el frontend y mueve el build al backend/static
RUN cd frontend && npm run build --silent \
    && rm -rf ../backend/app/static || true \
    && mv build ../backend/app/static

# Copia entrypoint
COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

# Entrypoint usa la variable de entorno PORT puesta por Railway. Por defecto 8000.
CMD ["/entrypoint.sh"]