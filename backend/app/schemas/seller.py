from typing import Optional
from typing_extensions import Annotated
from pydantic import BaseModel, EmailStr, constr

class SellerBase(BaseModel):
    name:  Annotated[str,constr(max_length=100)]
    email: str

class SellerCreate(SellerBase):
    password: Annotated[str,constr(min_length=6)]

class Seller(SellerBase):
    id: int

    class Config:
        from_attributes = True


class SellerUpdate(BaseModel):
    name: Optional[Annotated[str,constr(max_length=100)]] = None
    email: Optional[EmailStr] = None
    password: Optional[Annotated[str,constr(min_length=6)]] = None