from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
from pathlib import Path
from dotenv import load_dotenv
from app.db import Base


# ---------------------------------------------------------
# CARGA DE VARIABLES DE ENTORNO (.env)
# ---------------------------------------------------------
# Subimos un nivel desde /backend/alembic hasta /backend/.env
dotenv_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=dotenv_path)

# Leer la URL de Render
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ No se encontró la variable DATABASE_URL en el archivo .env")

print(f"✅ URL de conexión detectada: {DATABASE_URL}")

# ---------------------------------------------------------
# CONFIGURACIÓN DE ALEMBIC
# ---------------------------------------------------------
config = context.config
config.set_main_option("sqlalchemy.url", str(DATABASE_URL))

# Configuración de logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Vincula la metadata de tus modelos (para autogenerar migraciones)
target_metadata = Base.metadata


# ---------------------------------------------------------
# FUNCIONES BASE DE ALEMBIC
# ---------------------------------------------------------
def run_migrations_offline():
    """Ejecuta migraciones en modo offline."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Ejecuta migraciones en modo online (con conexión activa)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


# ---------------------------------------------------------
# EJECUCIÓN PRINCIPAL
# ---------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
