from typing_extensions import Annotated
from pydantic import BaseModel, constr
from typing import Optional
from app.schemas.seller import Seller
from app.schemas.category import Category

class ProductBase(BaseModel):
    name: Annotated[str,constr(max_length=60)]
    description: Annotated[str,constr(max_length=150)]
    price: float
    stock_quantity: int = 0
    image: str


class ProductCreate(ProductBase):
    category_id: int
    seller_id: int

class Product(ProductBase):
    id: int
    category: Optional["Category"]
    seller: Optional["Seller"]

    class Config:
        from_attributes = True
