from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app import simulador
from pathlib import Path
import logging

app = FastAPI(
    title="Simulador PAES API",
    version="1.0.0",
    contact={"name": "Simulador PAES"},
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("simulador")

# Incluir router principal
app.include_router(simulador.router)

# Endpoints base de verificación
@app.get("/", tags=["default"])
def root():
    # Serve the frontend index for the app root so the SPA loads in the browser.
    base_dir = Path(__file__).resolve().parent
    static_root = base_dir / "static"
    index_path = static_root / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    # Fallback: return a small JSON if frontend is not present
    return {"status": "ok", "frontend": "not_found"}

@app.get("/health", tags=["default"])
def health():
    return {"status": "ok"}


# Mount static files (frontend build). When running inside the container the
# working directory is `backend` (see `scripts/entrypoint.sh`), so the build
# was moved to `app/static`. Expose the JS/CSS under `/static` and serve
# `index.html` for unknown routes to support the SPA router.
# Mount static files. Compute paths relative to this file so behavior does not
# depend on the current working directory used by the container.
base_dir = Path(__file__).resolve().parent
static_root = base_dir / "static"
# CRA build usually places assets under <build>/static
static_assets_dir = static_root / "static"
if static_assets_dir.exists() and static_assets_dir.is_dir():
    mount_dir = static_assets_dir
elif static_root.exists() and static_root.is_dir():
    mount_dir = static_root
else:
    # Directory missing: log and mount a non-existing path will raise at import time,
    # so we avoid mounting and let requests fall back to the root handler.
    logger.warning(f"Frontend static directory not found: {static_root}")
    mount_dir = None

if mount_dir:
    app.mount("/static", StaticFiles(directory=str(mount_dir)), name="static")


@app.get("/{full_path:path}", include_in_schema=False)
def spa_catch_all(full_path: str):
    # If a request does not match an API route, return the SPA index.html
    base_dir = Path(__file__).resolve().parent
    index_path = base_dir / "static" / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "frontend": "not_found"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
