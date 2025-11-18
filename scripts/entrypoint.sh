#!/bin/sh
# Entrypoint para Docker/Railway: arranca uvicorn con el PORT que provea el entorno.
PORT=${PORT:-8000}
echo "--- Entrypoint start ---"
echo "PORT=${PORT}"
echo "PWD=$(pwd)"
echo "Listing backend/app contents:"
ls -la backend/app || true
echo "Starting uvicorn on 0.0.0.0:${PORT} (with access logs)"
# Cambiamos al directorio backend para que las rutas relativas funcionen (main espera cwd backend)
cd backend || exit 1
exec python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --log-level info --access-log