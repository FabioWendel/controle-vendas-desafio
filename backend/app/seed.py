from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import User as UserModel
from app.models.seller import Seller as SellerModel
from app.models.category import Category as CategoryModel
from app.models.product import Product as ProductModel
from app.models.sale import Sale as SaleModel
from app.schemas.user import UserCreate
from app.schemas.seller import SellerCreate
from app.schemas.category import CategoryCreate
from app.schemas.product import ProductCreate
from app.core.security import get_password_hash

def seed_data(db: Session):
    # Deletar todas as tabelas o problema estava tendo
    print("Deleting all data...")
    db.execute(text('''TRUNCATE TABLE sales, products, categories, users, sellers RESTART IDENTITY CASCADE;'''))
    db.commit()
    print("All data deleted.")

    category_data = [
        CategoryCreate(name="Category 1", description="Category 1 description"),
        CategoryCreate(name="Category 2", description="Category 2 description"),
    ]
    print("Seeding categories...")
    for category in category_data:
        db_category = CategoryModel(name=category.name, description=category.description)
        db.add(db_category)
    db.commit()
    print("Categories seeded.")

    seller_data = [
        SellerCreate(name="Seller 1", email="seller1@example.com", password="202425"),
        SellerCreate(name="Seller 2", email="seller2@example.com", password="202425"),
    ]
    print("Seeding sellers...")
    for seller in seller_data:
        hashed_password = get_password_hash(seller.password)
        db_seller = SellerModel(name=seller.name, email=seller.email, hashed_password=hashed_password)
        db.add(db_seller)
    db.commit()
    print("Sellers seeded.")

    user_data = [
        UserCreate(name="user1", email="user1@example.com", password="202425"),
        UserCreate(name="user2", email="user2@example.com", password="202425"),
    ]
    print("Seeding users...")
    for user in user_data:
        hashed_password = get_password_hash(user.password)
        db_user = UserModel(name=user.name, email=user.email, hashed_password=hashed_password)
        db.add(db_user)
    db.commit()
    print("Users seeded.")

    product_data = [
        ProductCreate(name="Product 1", description="Description 1", price=10.0, stock_quantity=100, image="camisa.png", category_id=1, seller_id=1),
        ProductCreate(name="Product 2", description="Description 2", price=20.0, stock_quantity=4, image="888.png", category_id=2, seller_id=2),
        ProductCreate(name="Product 3", description="Description 3", price=30.0, stock_quantity=0, image="camisa3.png", category_id=1, seller_id=1),
    ]
    print("Seeding products...")
    for product in product_data:
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
    print("Products seeded.")
