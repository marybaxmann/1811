# app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash

# --- Usuarios (CRUD) ---

def get_user_by_email(db: Session, email: str):
    return db.query(models.Usuario).filter(models.Usuario.email == email).first()

def get_user_by_id(db: Session, user_id: int):      # ← NUEVO
    return db.query(models.Usuario).filter(models.Usuario.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)

    db_user = models.Usuario(
        email=user.email,
        hashed_password=hashed_password,
        nombre=user.nombre,
        apellido=user.apellido,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
