from sqlalchemy import Column, DateTime, Integer, String, Float, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(60), index=True, nullable=False)
    description = Column(String(150))
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", back_populates="products")
    seller_id = Column(Integer, ForeignKey('sellers.id'), nullable=False)
    seller = relationship("Seller", back_populates="products")
    image = Column(String, nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
