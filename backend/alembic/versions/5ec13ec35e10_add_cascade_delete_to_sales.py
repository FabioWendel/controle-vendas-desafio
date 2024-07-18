"""Add cascade delete to sales

Revision ID: 5ec13ec35e10
Revises: 06b0ac38ac24
Create Date: 2024-07-18 12:50:45.460598

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5ec13ec35e10'
down_revision: Union[str, None] = '06b0ac38ac24'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('sales_seller_id_fkey', 'sales', type_='foreignkey')
    op.drop_constraint('sales_product_id_fkey', 'sales', type_='foreignkey')
    op.drop_constraint('sales_user_id_fkey', 'sales', type_='foreignkey')
    op.create_foreign_key(None, 'sales', 'sellers', ['seller_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'sales', 'products', ['product_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'sales', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'sales', type_='foreignkey')
    op.drop_constraint(None, 'sales', type_='foreignkey')
    op.drop_constraint(None, 'sales', type_='foreignkey')
    op.create_foreign_key('sales_user_id_fkey', 'sales', 'users', ['user_id'], ['id'])
    op.create_foreign_key('sales_product_id_fkey', 'sales', 'products', ['product_id'], ['id'])
    op.create_foreign_key('sales_seller_id_fkey', 'sales', 'sellers', ['seller_id'], ['id'])
    # ### end Alembic commands ###