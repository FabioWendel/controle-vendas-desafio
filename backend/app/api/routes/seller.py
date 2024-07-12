from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import List
from app.models.user import User
from app.schemas.seller import SellerCreate, Seller, SellerUpdate
from app.models.seller import Seller as SellerModel
from app.core.security import get_current_active_user, get_password_hash
from app.db.session import SessionLocal, get_db

router = APIRouter()

@router.post("/", response_model=Seller)
def create_seller(seller: SellerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_seller = db.query(SellerModel).filter(SellerModel.email == seller.email).first()
        if db_seller:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(seller.password)
        db_seller = SellerModel(name=seller.name, email=seller.email, hashed_password=hashed_password)
        db.add(db_seller)
        db.commit()
        db.refresh(db_seller)
        return db_seller
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Seller])
def read_sellers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        sellers = db.query(SellerModel).order_by(desc(SellerModel.updated_at)).offset(skip).limit(limit).all()
        return sellers
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{seller_id}", response_model=Seller)
def read_seller(seller_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_seller = db.query(SellerModel).filter(SellerModel.id == seller_id).first()
        if not db_seller:
            raise HTTPException(status_code=404, detail="Seller not found")
        return db_seller
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put("/{seller_id}", response_model=Seller)
def update_seller(seller_id: int, seller_update: SellerUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:

        db_seller = db.query(SellerModel).filter(SellerModel.id == seller_id).first()
        if not db_seller:
            raise HTTPException(status_code=404, detail="Seller not found")
        
        if seller_update.name:
            db_seller.name = seller_update.name
        if seller_update.email:
            existing_seller = db.query(SellerModel).filter(SellerModel.email == seller_update.email).first()
            if existing_seller and existing_seller.id != seller_id:
                raise HTTPException(status_code=400, detail="Email already registered")
            db_seller.email = seller_update.email
        if seller_update.password:
            hashed_password = get_password_hash(seller_update.password)
            db_seller.hashed_password = hashed_password
        
        db.commit()
        db.refresh(db_seller)
        return db_seller
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{seller_id}", response_model=Seller)
def delete_seller(seller_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_seller = db.query(SellerModel).filter(SellerModel.id == seller_id).first()
        if not db_seller:
            raise HTTPException(status_code=404, detail="Seller not found")
        db.delete(db_seller)
        db.commit()
        return db_seller
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
