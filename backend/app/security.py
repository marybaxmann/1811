# app/security.py

from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from os import getenv

# Hashing
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Config
SECRET_KEY = getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2
OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="/auth/token")

# ---------------- HASH ----------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return PWD_CONTEXT.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return PWD_CONTEXT.hash(password)

# ---------------- JWT ----------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Espera un diccionario con al menos:
    {
        "sub": "user_id",
        "email": "correo"
    }
    """

    if "sub" not in data:
        raise ValueError("El token requiere el campo 'sub' (user_id)")

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
