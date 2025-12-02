# app/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from . import schemas, crud, db, security
from .models import Usuario

router = APIRouter(prefix="/auth", tags=["auth"])

get_db = db.get_db


# -------- Obtener usuario de token --------
def get_current_user(
    token: str = Depends(security.OAUTH2_SCHEME),
    db: Session = Depends(get_db)
):

    payload = security.decode_access_token(token)

    user_id = payload.get("sub")     # ← ahora sí existe

    if user_id is None:
        raise HTTPException(401, "Token inválido")

    user = crud.get_user_by_id(db, int(user_id))

    if not user:
        raise HTTPException(401, "Usuario no encontrado")

    return user


# -------- Registro --------
@router.post("/register", response_model=schemas.UserOut, status_code=201)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing = crud.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(400, "El email ya está registrado")

    return crud.create_user(db, user)


# -------- Login --------
@router.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = crud.get_user_by_email(db, form_data.username)

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(401, "Email o contraseña incorrectos")

    token = security.create_access_token({
        "sub": str(user.id),      # ← estándar OAuth2
        "email": user.email
    })

    return {"access_token": token, "token_type": "bearer"}


# -------- Usuario actual --------
@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: Usuario = Depends(get_current_user)):
    return current_user
