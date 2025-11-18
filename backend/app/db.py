import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Ruta ABSOLUTA al .env
ENV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(ENV_PATH)

print(">> CARGANDO .env DESDE:", ENV_PATH)

DB_URL = os.getenv("DATABASE_URL")

print(">> USANDO DATABASE_URL =", DB_URL)

engine = create_engine(DB_URL, pool_pre_ping=True, future=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
