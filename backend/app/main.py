from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import logging

from app import simulador

# ===========================
#  CONFIGURACIÓN BASE
# ===========================
app = FastAPI(
    title="Simulador PAES API",
    version="1.0.0",
    contact={"name": "Simulador PAES"},
)

# ===========================
#  CORS
# ===========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
#  STATIC SIN CACHE
# ===========================
class NoCacheStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "no-store"
        return response

# Ruta absoluta correcta hacia backend/app/static
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

# Montar archivos estáticos
app.mount(
    "/static",
    NoCacheStaticFiles(directory=str(STATIC_DIR)),
    name="static",
)

# ===========================
#  ROUTER PRINCIPAL
# ===========================
logger = logging.getLogger("simulador")
app.include_router(simulador.router)

# ===========================
#  RUTA BASE DEL FRONTEND
# ===========================
@app.get("/", tags=["default"])
def root():
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "frontend": "not_found"}

@app.get("/health", tags=["default"])
def health():
    return {"status": "ok"}

# ===========================
#  SPA CATCH-ALL (react router)
# ===========================
@app.get("/{full_path:path}", include_in_schema=False)
def spa(full_path: str):
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "frontend": "not_found"}

# ===========================
#  SERVER LOCAL
# ===========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
