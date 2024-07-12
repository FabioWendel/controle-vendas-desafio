import os
from PIL import Image
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.security import get_current_active_user
from app.models.user import User
from app.schemas.product import ProductCreate, Product
from app.models.product import Product as ProductModel
from app.db.session import SessionLocal, get_db

router = APIRouter()

@router.post("/")
async def create_product(
    name: str = Form(None),
    price: float = Form(None),
    category_id: int = Form(None),
    seller_id: int = Form(None),
    stock_quantity: int = Form(None),
    description: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        image_filename = None
        if image:
            image_filename = image.filename
            image_path = os.path.join(os.getenv("UPLOAD_DIR"), image_filename)
            with open(image_path, "wb") as buffer:
                buffer.write(await image.read())

            with Image.open(image_path) as img:
                img = img.resize((200, 200)) 
                img.save(image_path)

        db_product = ProductModel(
             name=name,
            description=description,
            price=price,
            category_id=category_id,
            seller_id=seller_id,
            stock_quantity=stock_quantity,
            image=image_filename
        )
        db_product.image = image_filename
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Product])
def read_products(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        products = db.query(ProductModel).order_by(desc(ProductModel.updated_at)).offset(skip).limit(limit).all()
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category_id: Optional[int] = Form(None),
    seller_id: Optional[int] = Form(None),
    stock_quantity: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")

        if name is not None:
            db_product.name = name
        if price is not None:
            db_product.price = price
        if category_id is not None:
            db_product.category_id = category_id
        if seller_id is not None:
            db_product.seller_id = seller_id
        if stock_quantity is not None:
            db_product.stock_quantity = stock_quantity
        if description is not None:
            db_product.description = description
        print("==>", image)
        if image:
            image_filename = image.filename
            image_path = os.path.join(os.getenv("UPLOAD_DIR"), image_filename)
            with open(image_path, "wb") as buffer:
                buffer.write(await image.read())
            db_product.image = image_filename

        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{product_id}", response_model=Product)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        db.delete(db_product)
        db.commit()
        return db_product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{product_id}/update-stock", response_model=Product)
async def update_product_stock(
    product_id: int,
    subtract_quantity: int = Form(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")

        if subtract_quantity <= db_product.stock_quantity:
            db_product.stock_quantity -= subtract_quantity
        else:
            raise HTTPException(status_code=400, detail="Subtract quantity exceeds current stock")

        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))