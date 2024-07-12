from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import List
from app.core.security import get_current_active_user
from app.schemas.category import CategoryCreate, Category
from app.models.category import Category as CategoryModel
from app.db.session import SessionLocal, get_db
from app.models.user import User


router = APIRouter()

@router.post("/", response_model=Category)
def create_category(category: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_category = CategoryModel(**category.model_dump())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Category])
def read_categories(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        categories = db.query(CategoryModel).order_by(desc(CategoryModel.updated_at)).offset(skip).limit(limit).all()
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{category_id}", response_model=Category)
def read_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        return db_category
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put("/{category_id}", response_model=Category)
def update_category(category_id: int, category: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        db_category.name = category.name
        db_category.description = category.description
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{category_id}", response_model=Category)
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        db.delete(db_category)
        db.commit()
        return db_category
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))