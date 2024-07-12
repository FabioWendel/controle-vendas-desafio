from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.models.seller import Seller
from app.schemas.user import UserCreate, UserInDB, UserUpdate
from app.models.user import User
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, get_password_hash, create_access_token
from app.db.session import get_db
from typing import List
from app.core.security import get_current_active_user



router = APIRouter()

@router.post("/signup", response_model=UserInDB)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(user.password)
        db_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/signin")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        db_user = authenticate_user(db, form_data.username, form_data.password)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": db_user.email}, expires_delta=access_token_expires)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "name": db_user.name,
            "id": db_user.id,
            "type": "seller" if isinstance(db_user, Seller) else "user"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ROTAS DOS USUARIOS TOD0 FAZER UM MODULO DIFERENTE
@router.get("/users", response_model=List[UserInDB])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        users = db.query(User).order_by(desc(User.updated_at)).offset(skip).limit(limit).all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users/{user_id}", response_model=UserInDB)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user_update.name:
            db_user.name = user_update.name
        if user_update.email:
            existing_user = db.query(User).filter(User.email == user_update.email).first()
            if existing_user and existing_user.id != user_id:
                raise HTTPException(status_code=400, detail="Email already registered")
            db_user.email = user_update.email
        if user_update.password:
            hashed_password = get_password_hash(user_update.password)
            db_user.hashed_password = hashed_password
        
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        db.delete(db_user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
