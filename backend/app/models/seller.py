from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from app.db.base import Base
from sqlalchemy.orm import relationship


class Seller(Base):
    __tablename__ = "sellers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    hashed_password = Column(String, nullable=False)
    products = relationship("Product", back_populates="seller")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

