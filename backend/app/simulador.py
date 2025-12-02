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

    sql = text("""
        SELECT 
            c.id,
            c.nombre,
            c.area,
            c.duracion,
            c.vacantes,
            c.arancel,

            u.id AS universidad_id,
            u.nombre AS universidad,
            u.acreditacion,
            u.tipo_acreditacion,
            u.sitio_web,
            u.direccion,
            u.region,

            p.w_lenguaje,
            p.w_matematicas,
            p.w_matematicas2,
            p.w_ciencias,
            p.w_historia,
            p.w_nem,
            p.w_ranking

        FROM carreras c
        JOIN universidades u ON u.id = c.universidad_id
        LEFT JOIN ponderaciones p ON p.carrera_id = c.id
        WHERE c.id = :cid
        LIMIT 1
    """)

    row = db.execute(sql, {"cid": carrera_id}).mappings().first()

    if not row:
        raise HTTPException(404, "Carrera no encontrada")

    # Obtener historial de puntajes de corte
    puntajes = db.execute(text("""
        SELECT ano, puntaje_minimo
        FROM puntajes_corte
        WHERE carrera_id = :cid
        ORDER BY ano DESC
    """), {"cid": carrera_id}).mappings().all()

    puntajes_list = [
        {
            "ano": int(p["ano"]),
            "puntaje_minimo": float(p["puntaje_minimo"])
        }
        for p in puntajes
    ]

    return DetalleCarrera(
        id=row["id"],
        nombre=row["nombre"],
        area=row["area"],
        duracion=row["duracion"],
        vacantes=row["vacantes"],
        arancel=row["arancel"],

        universidad_id=row["universidad_id"],
        universidad=row["universidad"],
        acreditacion=row["acreditacion"],
        tipo_acreditacion=row["tipo_acreditacion"],
        sitio_web=row["sitio_web"],
        direccion=row["direccion"],
        region=row["region"],

        w_lenguaje=float(row["w_lenguaje"] or 0),
        w_matematicas=float(row["w_matematicas"] or 0),
        w_matematicas2=float(row["w_matematicas2"] or 0),
        w_ciencias=float(row["w_ciencias"] or 0),
        w_historia=float(row["w_historia"] or 0),
        w_nem=float(row["w_nem"] or 0),
        w_ranking=float(row["w_ranking"] or 0),

        puntajes_corte=puntajes_list
    )



# ============================================================
# 📌 ENDPOINT → LISTA DE ÁREAS
# ============================================================
@router.get("/areas")
def listar_areas(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT DISTINCT area FROM carreras WHERE area IS NOT NULL")).fetchall()
    return sorted([r[0] for r in rows])