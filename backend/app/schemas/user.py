from typing_extensions import Annotated
from pydantic import BaseModel, EmailStr, constr
from typing import Optional


class UserBase(BaseModel):
    name: Annotated[str,constr(max_length=100)]
    email: EmailStr
    is_active: Optional[bool] = True
    is_admin: Optional[bool] = False

class UserCreate(UserBase):
    password: Annotated[str,constr(min_length=6)]

class UserInDB(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    name: Optional[Annotated[str,constr(max_length=100)]] = None
    email: Optional[EmailStr] = None
    password: Optional[Annotated[str,constr(min_length=6)]] = None