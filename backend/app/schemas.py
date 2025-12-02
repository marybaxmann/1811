from typing import Optional, List
from pydantic import BaseModel, Field

# -------- Entradas --------
class SimularRequest(BaseModel):
    ano: int = 2024   # Año fijo por defecto
    lenguaje: float
    matematicas: float
    matematicas2: float
    ciencias: float
    historia: float
    nem: float
    ranking: float
    universidad: Optional[str] = None
    carrera: Optional[str] = None
    limit: int = 2000


# -------- Salidas --------
class OpcionPostulacion(BaseModel):
    universidad: str
    carrera: str
    puntaje_corte: float
    puntaje_ponderado: float
    margen: float  # ponderado - corte

# para endpoints de catálogo
class UniversidadOut(BaseModel):
    id: int
    nombre: str
    acreditacion: Optional[int] = None
    sitio_web: Optional[str] = None
    direccion: Optional[str] = None
    class Config:
        from_attributes = True



# ... (clases existentes: SimularRequest, OpcionPostulacion, UniversidadOut)

# -------- Autenticación (NUEVO) --------
class UserCreate(BaseModel):
    email: str = Field(..., max_length=100)
    password: str = Field(..., min_length=6)
    nombre: Optional[str] = None
    apellido: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class TokenData(BaseModel):
    email: Optional[str] = None
    # -------- Detalle de Carrera --------
class DetalleCarrera(BaseModel):
    id: int
    nombre: str
    area: Optional[str] = None
    duracion: Optional[int] = None
    vacantes: Optional[int] = None
    arancel: Optional[int] = None

    # Universidad
    universidad_id: int
    universidad: str
    acreditacion: Optional[int] = None
    tipo_acreditacion: Optional[str] = None
    sitio_web: Optional[str] = None
    direccion: Optional[str] = None
    region: Optional[str] = None

    # Ponderaciones
    w_lenguaje: float = 0
    w_matematicas: float = 0
    w_matematicas2: float = 0
    w_ciencias: float = 0
    w_historia: float = 0
    w_nem: float = 0
    w_ranking: float = 0

    # Puntajes de corte
    puntajes_corte: Optional[List[dict]] = None

    class Config:
        from_attributes = True
