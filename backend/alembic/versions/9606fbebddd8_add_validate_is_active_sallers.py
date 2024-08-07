"""Add validate is active sallers

Revision ID: 9606fbebddd8
Revises: bb81fd324311
Create Date: 2024-07-11 03:45:33.033483

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9606fbebddd8'
down_revision: Union[str, None] = 'bb81fd324311'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('categories', 'description',
               existing_type=sa.VARCHAR(length=150),
               nullable=True)
    op.add_column('sellers', sa.Column('is_active', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('sellers', 'is_active')
    op.alter_column('categories', 'description',
               existing_type=sa.VARCHAR(length=150),
               nullable=False)
    # ### end Alembic commands ###
