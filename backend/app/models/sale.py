from sqlalchemy import Column, DateTime, Integer, ForeignKey, Float, func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    seller_id = Column(Integer, ForeignKey('sellers.id', ondelete='CASCADE'))
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    product = relationship("Product")
    user = relationship("User")
    seller = relationship("Seller")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
