"""Add relaship in product and saller

Revision ID: 8b9063dfe5de
Revises: d13dcab89b5a
Create Date: 2024-07-10 22:03:12.108155

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8b9063dfe5de'
down_revision: Union[str, None] = 'd13dcab89b5a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('products', sa.Column('seller_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'products', 'sellers', ['seller_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'products', type_='foreignkey')
    op.drop_column('products', 'seller_id')
    # ### end Alembic commands ###
