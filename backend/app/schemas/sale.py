from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserInDB as User
from app.schemas.product import Product
from app.schemas.seller import Seller
from app.schemas.category import Category

class SaleBase(BaseModel):
    product_id: int
    user_id: int
    seller_id: int
    quantity: int
    total_price: float

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    category: Optional["Category"]
    seller: Optional["Seller"]
    product: Optional["Product"]
    user: Optional["User"]
    date: Optional[datetime]



    class Config:
        from_attributes = True
