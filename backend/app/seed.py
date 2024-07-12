from sqlalchemy.orm import Session
from app.models.user import User as UserModel
from app.models.seller import Seller as SellerModel
from app.models.category import Category as CategoryModel
from app.models.product import Product as ProductModel
from app.schemas.user import UserCreate
from app.schemas.seller import SellerCreate
from app.schemas.category import CategoryCreate
from app.schemas.product import ProductCreate
from app.core.security import get_password_hash



def seed_data(db: Session):
    # Seed sellers primeiro
    seller_data = [
        SellerCreate(name="Seller 1", email="seller1@example.com", password="202425"),
        SellerCreate(name="Seller 2", email="seller2@example.com", password="202425"),
    ]
    for seller in seller_data:
        db_seller = db.query(SellerModel).filter(SellerModel.email == seller.email).first()
        if db_seller:
            db.delete(db_seller)
        hashed_password = get_password_hash(seller.password)
        db_seller = SellerModel(name=seller.name, email=seller.email, hashed_password=hashed_password)
        db.add(db_seller)
    
    # Commit vendedores antes de continuar
    db.commit()

    # Seed users
    user_data = [
        UserCreate(name="user1", email="user1@example.com", password="202425"),
        UserCreate(name="user2", email="user2@example.com", password="202425"),
    ]
    for user in user_data:
        db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
        if db_user:
            db.delete(db_user)
        hashed_password = get_password_hash(user.password)
        db_user = UserModel(name=user.name, email=user.email, hashed_password=hashed_password)
        db.add(db_user)

    # Seed categories
    category_data = [
        CategoryCreate(name="Category 1", description="Category 1 description"),
        CategoryCreate(name="Category 2", description="Category 2 description"),
    ]
    for category in category_data:
        db_category = db.query(CategoryModel).filter(CategoryModel.name == category.name).first()
        if db_category:
            db.delete(db_category)
        db_category = CategoryModel(name=category.name, description=category.description)
        db.add(db_category)

    # Seed products
    product_data = [
        ProductCreate(name="Product 1", description="Description 1", price=10.0, stock_quantity=100, image="camisa.png", category_id=1, seller_id=1),
        ProductCreate(name="Product 2", description="Description 2", price=20.0, stock_quantity=4, image="888.png", category_id=2, seller_id=2),
        ProductCreate(name="Product 3", description="Description 3", price=30.0, stock_quantity=0, image="camisa3.png", category_id=1, seller_id=1),
    ]
    for product in product_data:
        db_product = db.query(ProductModel).filter(ProductModel.name == product.name).first()
        if db_product:
            db.delete(db_product)
        db_product = ProductModel(
            name=product.name,
            description=product.description,
            price=product.price,
            stock_quantity=product.stock_quantity,
            image=product.image,
            category_id=product.category_id,
            seller_id=product.seller_id
        )
        db.add(db_product)

    db.commit()