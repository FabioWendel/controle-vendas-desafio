from pydantic import BaseModel, constr
from typing import List
from typing_extensions import Annotated

class CategoryBase(BaseModel):
    name:Annotated[str, constr(max_length=60)]
    description:Annotated[str, constr(max_length=150)]


class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True
