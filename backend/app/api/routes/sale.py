from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import List
from app.core.security import get_current_active_user
from app.models.user import User
from app.schemas.sale import SaleCreate, Sale
from app.models.sale import Sale as SaleModel
from app.models.product import Product as ProductModel
from app.db.session import SessionLocal, get_db

router = APIRouter()

@router.post("/", response_model=Sale)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        product_id = sale.product_id
        quantity = sale.quantity

        db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

        if quantity > db_product.stock_quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {db_product.name}")
            
        db_product.stock_quantity -= quantity


        db_sale = SaleModel(**sale.model_dump())
        db.add(db_sale)
        db.commit()
        db.refresh(db_sale)

        db_sale.category = db_product.category
        db_sale.seller = db_product.seller


        return db_sale
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Sale])
def read_sales(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        sales = db.query(SaleModel).order_by(desc(SaleModel.updated_at)).offset(skip).limit(limit).all()

        for sale in sales:
            sale.category = sale.product.category
            sale.seller = sale.product.seller
            sale.date = sale.created_at
        return sales
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{sale_id}", response_model=Sale)
def read_sale(sale_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
        if not db_sale:
            raise HTTPException(status_code=404, detail="Sale not found")
        return db_sale
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{sale_id}", response_model=Sale)
def update_sale(sale_id: int, sale: SaleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
        if not db_sale:
            raise HTTPException(status_code=404, detail="Sale not found")
        for var, value in vars(sale).items():
            setattr(db_sale, var, value)
        db.add(db_sale)
        db.commit()
        db.refresh(db_sale)
        return db_sale
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{sale_id}", response_model=Sale)
def delete_sale(sale_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
        if not db_sale:
            raise HTTPException(status_code=404, detail="Sale not found")
        db.delete(db_sale)
        db.commit()
        return db_sale
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
