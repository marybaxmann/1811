from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app import simulador

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

# Incluir router principal
app.include_router(simulador.router)

# Endpoints base de verificación
@app.get("/", tags=["default"])
def root():
    # Serve the frontend index for the app root so the SPA loads in the browser.
    index_path = "backend/app/static/index.html"
    return FileResponse(index_path)

@app.get("/health", tags=["default"])
def health():
    return {"status": "ok"}


# Mount static files (frontend build). When running inside the container the
# working directory is `backend` (see `scripts/entrypoint.sh`), so the build
# was moved to `app/static`. Expose the JS/CSS under `/static` and serve
# `index.html` for unknown routes to support the SPA router.
app.mount("/static", StaticFiles(directory="backend/app/static/static"), name="static")


@app.get("/{full_path:path}", include_in_schema=False)
def spa_catch_all(full_path: str):
    # If a request does not match an API route, return the SPA index.html
    index_path = "backend/app/static/index.html"
    return FileResponse(index_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
