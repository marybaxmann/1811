import psycopg2
from pymongo import MongoClient

# -------- CONEXIÓN SQL (Render) --------
sql_conn = psycopg2.connect(
    host="dpg-d43pgb63jp1c73ah5ut0-a.oregon-postgres.render.com",
    port=5432,
    dbname="demre2024_full",
    user="demre2024_full_user",
    password="WsuGr8Tm4DqoIH7xzaV8usIC37Bh5K1Q",
    sslmode="require"
)

sql = sql_conn.cursor()

# -------- CONEXIÓN MONGO (Atlas) --------
mongo = MongoClient(
    "mongodb+srv://marybaxman:simulador2025@cluster0.3kmlayc.mongodb.net/"
)
db = mongo["simulador"]
col = db["universidades"]

# Limpiar colección existente
col.delete_many({})
print("Colección 'universidades' limpiada.\n")

# -------- MIGRAR UNIVERSIDADES --------
sql.execute("""
    SELECT id, nombre, acreditacion, sitio_web, direccion, latitud, longitud, region, tipo_acreditacion
    FROM universidades
""")

universidades = sql.fetchall()

for u in universidades:
    (
        uni_id, nombre, acreditacion, sitio_web,
        direccion, latitud, longitud, region, tipo_acreditacion
    ) = u

    # -------- MIGRAR CARRERAS --------
    sql.execute("""
        SELECT id, nombre, codigo_demre, duracion, vacantes, arancel, area
        FROM carreras
        WHERE universidad_id = %s
    """, (uni_id,))

    carreras_sql = sql.fetchall()
    carreras_docs = []

    for c in carreras_sql:
        (
            carrera_id, c_nombre, codigo_demre,
            duracion, vacantes, arancel, area
        ) = c

        # -------- MIGRAR PONDERACIONES --------
        sql.execute("""
            SELECT w_lenguaje, w_matematicas, w_matematicas2,
                   w_ciencias, w_historia, w_nem, w_ranking
            FROM ponderaciones
            WHERE carrera_id = %s
        """, (carrera_id,))
        
        p = sql.fetchone()
        
        if p:
            ponderaciones = {
                "lenguaje": float(p[0]),
                "m1": float(p[1]),
                "m2": float(p[2]),
                "ciencias": float(p[3]),
                "historia": float(p[4]),
                "nem": float(p[5]),
                "ranking": float(p[6])
            }
        else:
            ponderaciones = None

        # -------- MIGRAR PUNTAJES DE CORTE --------
        sql.execute("""
            SELECT ano, puntaje_minimo
            FROM puntajes_corte
            WHERE carrera_id = %s
        """, (carrera_id,))

        puntajes = [
            {"ano": row[0], "puntaje_minimo": float(row[1])}
            for row in sql.fetchall()
        ]

        # Documento de carrera
        carreras_docs.append({
            "id": carrera_id,
            "nombre": c_nombre,
            "codigo_demre": codigo_demre,
            "duracion": duracion,
            "vacantes": vacantes,
            "arancel": arancel,
            "area": area,
            "ponderaciones": ponderaciones,
            "puntajes_corte": puntajes
        })

    # -------- CREAR DOCUMENTO DE UNIVERSIDAD --------
    doc = {
        "_id": uni_id,
        "nombre": nombre,
        "acreditacion": acreditacion,
        "sitio_web": sitio_web,
        "direccion": direccion,
        "latitud": float(latitud) if latitud else None,
        "longitud": float(longitud) if longitud else None,
        "region": region,
        "tipo_acreditacion": tipo_acreditacion,
        "carreras": carreras_docs
    }

    col.insert_one(doc)
    print(f"Universidad '{nombre}' migrada con {len(carreras_docs)} carreras.")

print("\n🎉 MIGRACIÓN COMPLETADA CON ÉXITO.")
