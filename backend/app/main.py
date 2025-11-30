from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import logging

from app import simulador

# ============================
# APP BASE
# ============================
=======
from app import simulador

>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
app = FastAPI(
    title="Simulador PAES API",
    version="1.0.0",
    contact={"name": "Simulador PAES"},
)

<<<<<<< HEAD
# ============================
# CORS
# ============================
=======
# Middleware CORS
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# ============================
# STATIC SIN CACHE
# ============================
class NoCacheStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "no-store"
        return response

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR / "static"      # contiene index.html
STATIC_ASSETS = FRONTEND_DIR / "static"  # contiene css/js/img

# === FIX REAL ===
# Si existe la carpeta /static/static → montarla
if STATIC_ASSETS.exists():
    app.mount(
        "/static",
        NoCacheStaticFiles(directory=str(STATIC_ASSETS)),
        name="static",
    )
else:
    # fallback: montar /static por si solo
    app.mount(
        "/static",
        NoCacheStaticFiles(directory=str(FRONTEND_DIR)),
        name="static",
    )

# ============================
# ROUTER BACKEND
# ============================
logger = logging.getLogger("simulador")
app.include_router(simulador.router)

# ============================
# SERVIR index.html
# ============================
@app.get("/", include_in_schema=False)
def root():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"frontend": "index.html not found"}

# ============================
# REACT SPA CATCH-ALL
# ============================
@app.get("/{full_path:path}", include_in_schema=False)
def spa(full_path: str):
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"frontend": "index.html not found"}

# ============================
# LOCAL SERVER
# ============================
=======
# Incluir router principal
app.include_router(simulador.router)

# Endpoints base de verificación
@app.get("/", tags=["default"])
def root():
    return {"ok": True, "msg": "Simulador PAES API"}

@app.get("/health", tags=["default"])
def health():
    return {"status": "ok"}


>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
