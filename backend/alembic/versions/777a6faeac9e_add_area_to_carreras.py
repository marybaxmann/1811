"""add area to carreras

Revision ID: 777a6faeac9e
Revises: 8d16e09a1b3f
Create Date: 2025-11-03 01:56:07.888895
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '777a6faeac9e'
down_revision: Union[str, Sequence[str], None] = '8d16e09a1b3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """✅ Agrega la columna 'area' a la tabla 'carreras'."""
    op.add_column('carreras', sa.Column('area', sa.String(), nullable=True))


def downgrade() -> None:
    """🔙 Permite revertir el cambio si es necesario."""
    op.drop_column('carreras', 'area')
