from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy import text
<<<<<<< HEAD
from app.db import get_db
from sqlalchemy.orm import Session
from app.mongo_client import db
from app.schemas import SimulacionRequest


router = APIRouter(prefix="/simulador", tags=["simulador"])


=======
from app.db import get_db          # ← CORREGIDO
from sqlalchemy.orm import Session

router = APIRouter(prefix="/simulador", tags=["simulador"])

>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
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

<<<<<<< HEAD

=======
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
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
<<<<<<< HEAD
# 📌 ENDPOINT PRINCIPAL DEL SIMULADOR
=======
# 📌 ENDPOINT PRINCIPAL SIMULADOR
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
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
<<<<<<< HEAD
                ano=2024,   # ← FIX DEFINITIVO
=======
                ano=r["ano"],
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
            )
        )

    return resultados


# ============================================================
<<<<<<< HEAD
# 📌 DETALLE INDIVIDUAL DE UNA CARRERA
=======
# 📌 DETALLE INDIVIDUAL DE CARRERA
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
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
<<<<<<< HEAD


# ============================================================
# 📌 NUEVO ENDPOINT → LISTA DE ÁREAS
# ============================================================
@router.get("/areas")
def listar_areas(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT DISTINCT area FROM carreras WHERE area IS NOT NULL")).fetchall()
    return sorted([r[0] for r in rows])
@router.get("/universidades")
def listar_universidades():
    universidades = list(db.universidades.find({}, {"carreras": 0}))  
    # oculto carreras para que sea liviano

    for u in universidades:
        u["_id"] = str(u["_id"])  # convertir ObjectId a string

    return universidades
@router.post("/simular")
def simular(data: SimulacionRequest):
    
    universidades = db.universidades.find({})
    resultados = []

    for uni in universidades:
        for c in uni["carreras"]:
            p = c["ponderaciones"]

            if not p:
                continue

            puntaje = (
                data.puntaje_lenguaje * p["lenguaje"]
                + data.puntaje_matematicas * p["m1"]
                + data.puntaje_matematicas2 * p["m2"]
                + data.puntaje_ciencias * p["ciencias"]
                + data.puntaje_historia * p["historia"]
                + data.puntaje_nem * p["nem"]
                + data.puntaje_ranking * p["ranking"]
            )

            resultados.append({
                "universidad": uni["nombre"],
                "carrera": c["nombre"],
                "arancel": c["arancel"],
                "vacantes": c["vacantes"],
                "puntaje_total": puntaje,
                "puntajes_corte": c["puntajes_corte"],
            })

    resultados = sorted(resultados, key=lambda x: x["puntaje_total"], reverse=True)

    return resultados

=======
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
