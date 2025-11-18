from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy import text
from app.db import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/simulador", tags=["simulador"])


# ============================================================
# 📌 MODELO PARA OPCIONES
# ============================================================
class OpcionPostulacion(BaseModel):
    carrera_id: int
    carrera: str
    universidad: str
    area: Optional[str]
    puntaje_ponderado: float
    puntaje_corte: float
    margen: float
    ano: int


# ============================================================
# 📌 MODELO DETALLE CARRERA
# ============================================================
class DetalleCarrera(BaseModel):
    id: int
    nombre: str
    universidad: str
    area: Optional[str]

    duracion: Optional[int]
    vacantes: Optional[int]
    arancel: Optional[int]

    acreditacion: Optional[int]
    tipo_acreditacion: Optional[str]

    sitio_web: Optional[str]
    direccion: Optional[str]
    region: Optional[str]

    latitud: Optional[float]
    longitud: Optional[float]


# ============================================================
# 📌 ENDPOINT PRINCIPAL DEL SIMULADOR
# ============================================================
@router.post("/", response_model=List[OpcionPostulacion])
@router.post("/simular", response_model=List[OpcionPostulacion])
def simular(data: dict, db: Session = Depends(get_db)):

    query = text("""
        SELECT 
            c.id AS carrera_id,
            c.nombre AS carrera,
            u.nombre AS universidad,
            c.area,
            pc.puntaje_minimo AS puntaje_corte,
            pc.ano,

            (
                :lenguaje * p.w_lenguaje +
                :matematicas * p.w_matematicas +
                :matematicas2 * p.w_matematicas2 +
                :ciencias * p.w_ciencias +
                :historia * p.w_historia +
                :nem * p.w_nem +
                :ranking * p.w_ranking
            ) AS puntaje_ponderado

        FROM carreras c
        JOIN universidades u ON u.id = c.universidad_id
        LEFT JOIN ponderaciones p ON p.carrera_id = c.id
        LEFT JOIN puntajes_corte pc ON pc.carrera_id = c.id
    """)

    rows = db.execute(query, data).mappings().all()

    resultados = []
    for r in rows:
        ponderado = float(r["puntaje_ponderado"]) if r["puntaje_ponderado"] else 0
        corte = float(r["puntaje_corte"]) if r["puntaje_corte"] else 0

        resultados.append(
            OpcionPostulacion(
                carrera_id=r["carrera_id"],
                carrera=r["carrera"],
                universidad=r["universidad"],
                area=r["area"],
                puntaje_ponderado=ponderado,
                puntaje_corte=corte,
                margen=ponderado - corte,
                ano=2024,   # ← FIX DEFINITIVO
            )
        )

    return resultados


# ============================================================
# 📌 DETALLE INDIVIDUAL DE UNA CARRERA
# ============================================================
@router.get("/detalle/{carrera_id}", response_model=DetalleCarrera)
def detalle_carrera(carrera_id: int, db: Session = Depends(get_db)):

    q = text("""
        SELECT 
            c.id,
            c.nombre,
            c.area,
            c.duracion,
            c.vacantes,
            c.arancel,

            u.nombre AS universidad,
            u.acreditacion,
            u.sitio_web,
            u.direccion,
            u.region,
            u.latitud,
            u.longitud
        FROM carreras c
        JOIN universidades u ON u.id = c.universidad_id
        WHERE c.id = :cid
    """)

    row = db.execute(q, {"cid": carrera_id}).mappings().first()

    if not row:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")

    return DetalleCarrera(
        id=row["id"],
        nombre=row["nombre"],
        universidad=row["universidad"],
        area=row["area"],

        duracion=row["duracion"],
        vacantes=row["vacantes"],
        arancel=row["arancel"],

        acreditacion=row["acreditacion"],
        tipo_acreditacion="Certificación CNA" if row["acreditacion"] else None,

        sitio_web=row["sitio_web"],
        direccion=row["direccion"],
        region=row["region"],

        latitud=row["latitud"],
        longitud=row["longitud"],
    )


# ============================================================
# 📌 NUEVO ENDPOINT → LISTA DE ÁREAS
# ============================================================
@router.get("/areas")
def listar_areas(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT DISTINCT area FROM carreras WHERE area IS NOT NULL")).fetchall()
    return sorted([r[0] for r in rows])
