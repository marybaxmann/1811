# app/simulador.py

from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db import get_db
# Importamos los esquemas que necesitamos
from app import schemas 

router = APIRouter(prefix="/simulador", tags=["simulador"])

# NOTA: Los modelos OpcionPostulacion y DetalleCarrera DEBEN 
# importarse o definirse en 'app/schemas.py'
OpcionPostulacion = schemas.OpcionPostulacion
DetalleCarrera = schemas.DetalleCarrera


# ============================================================
# 📌 ENDPOINT PRINCIPAL DEL SIMULADOR (CORREGIDO)
# ============================================================
@router.post("/", response_model=List[OpcionPostulacion])
@router.post("/simular", response_model=List[OpcionPostulacion])
def simular(data: schemas.SimularRequest, db: Session = Depends(get_db)):

    params = data.model_dump()
    
    where_clauses = []
    
    # Filtrar por universidad (búsqueda parcial insensible a mayúsculas/minúsculas)
    if data.universidad:
        where_clauses.append("u.nombre ILIKE :universidad_filter")
        params["universidad_filter"] = f"%{data.universidad}%"

    # Filtrar por carrera (búsqueda parcial)
    if data.carrera:
        where_clauses.append("c.nombre ILIKE :carrera_filter")
        params["carrera_filter"] = f"%{data.carrera}%"

    # Filtrar por año (siempre debe aplicar)
    where_clauses.append("pc.ano = :ano")

    where_sql = " AND ".join(where_clauses)
    if where_sql:
        where_sql = " WHERE " + where_sql

    query_sql = f"""
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
        {where_sql}
        LIMIT :limit
    """

    query = text(query_sql)
    rows = db.execute(query, params).mappings().all()

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
                ano=r["ano"], 
            )
        )

    return resultados


# ============================================================
# 📌 DETALLE INDIVIDUAL DE UNA CARRERA
# ============================================================
@router.get("/detalle/{carrera_id}", response_model=DetalleCarrera)
def detalle_carrera(carrera_id: int, db: Session = Depends(get_db)):
    # ... (código existente)
    # NOTA: Asegúrate de que DetalleCarrera esté definido/importado correctamente.
    pass # Código de detalle_carrera omitido por brevedad.


# ============================================================
# 📌 ENDPOINT → LISTA DE ÁREAS
# ============================================================
@router.get("/areas")
def listar_areas(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT DISTINCT area FROM carreras WHERE area IS NOT NULL")).fetchall()
    return sorted([r[0] for r in rows])