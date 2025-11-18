from sqlalchemy import Column, Integer, String, DECIMAL, Float, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base

# =======================
#   Universidades
# =======================
class Universidad(Base):
    __tablename__ = "universidades"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)

    # 🔹 Datos de acreditación
    acreditacion = Column(Integer, nullable=True)
    tipo_acreditacion = Column(String(50), nullable=True)  # ✔ AGREGADO

    # 🔹 Información general
    sitio_web = Column(String(255), nullable=True)
    direccion = Column(String(255), nullable=True)
    region = Column(String(100), nullable=True)  # ✔ AGREGADO

    # 🔹 Coordenadas
    latitud = Column(DECIMAL(10, 7), nullable=True)
    longitud = Column(DECIMAL(10, 7), nullable=True)

    # Relación 1:N con carreras
    carreras = relationship("Carrera", back_populates="universidad")


# =======================
#   Carreras
# =======================
class Carrera(Base):
    __tablename__ = "carreras"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    
    duracion = Column(Integer, nullable=True)  # ✔ CAMBIADO A INTEGER
    vacantes = Column(Integer, nullable=True)
    arancel = Column(Integer, nullable=True)

    area = Column(String(120), nullable=True)

    universidad_id = Column(Integer, ForeignKey("universidades.id"), nullable=False)

    # Relaciones
    universidad = relationship("Universidad", back_populates="carreras")
    puntajes = relationship("PuntajeCorte", back_populates="carrera")
    ponderacion = relationship("Ponderacion", uselist=False, back_populates="carrera")


# =======================
#   Puntajes de corte
# =======================
class PuntajeCorte(Base):
    __tablename__ = "puntajes_corte"

    id = Column(Integer, primary_key=True, index=True)
    carrera_id = Column(Integer, ForeignKey("carreras.id"), nullable=False)

    puntaje_minimo = Column(DECIMAL(6, 2), nullable=False)
    ano = Column(Integer, nullable=False)

    carrera = relationship("Carrera", back_populates="puntajes")


# =======================
#   Simulaciones (opcional)
# =======================
class Simulacion(Base):
    __tablename__ = "simulaciones"

    id = Column(Integer, primary_key=True, index=True)
    carrera_id = Column(Integer, ForeignKey("carreras.id"), nullable=True)

    puntaje_lenguaje = Column(DECIMAL(5, 2), nullable=True)
    puntaje_matematicas = Column(DECIMAL(5, 2), nullable=True)
    puntaje_matematicas2 = Column(DECIMAL(5, 2), nullable=True)
    puntaje_ciencias = Column(DECIMAL(5, 2), nullable=True)
    puntaje_historia = Column(DECIMAL(5, 2), nullable=True)
    puntaje_historia_electiva = Column(DECIMAL(5, 2), nullable=True)
    puntaje_nem = Column(DECIMAL(5, 2), nullable=True)
    puntaje_ranking = Column(DECIMAL(5, 2), nullable=True)
    puntaje_total = Column(DECIMAL(5, 2), nullable=False)


# =======================
#   Ponderaciones
# =======================
class Ponderacion(Base):
    __tablename__ = "ponderaciones"

    id = Column(Integer, primary_key=True, index=True)
    carrera_id = Column(Integer, ForeignKey("carreras.id"), nullable=False, unique=True)

    w_lenguaje = Column(DECIMAL(5, 4), nullable=False, default=0)
    w_matematicas = Column(DECIMAL(5, 4), nullable=False, default=0)
    w_matematicas2 = Column(DECIMAL(5, 4), nullable=False, default=0)
    w_ciencias = Column(DECIMAL(5, 4), nullable=False, default=0)
    w_historia = Column(DECIMAL(5, 4), nullable=False, default=0)
    w_nem = Column(DECIMAL(5, 4), nullable=False, default=0)
    w_ranking = Column(DECIMAL(5, 4), nullable=False, default=0)

    carrera = relationship("Carrera", back_populates="ponderacion")


# Debug opcional
print(">>> CAMPOS Carrera:", Carrera.__table__.columns.keys())
print(">>> CAMPOS Universidad:", Universidad.__table__.columns.keys())
