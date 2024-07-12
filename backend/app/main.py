import os
from dotenv import load_dotenv
load_dotenv()
from fastapi.staticfiles import StaticFiles
from app.db.session import SessionLocal
from app.seed import seed_data
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, category, product, sale, seller



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(category.router, prefix="/categories", tags=["categories"])
app.include_router(product.router, prefix="/products", tags=["products"])
app.include_router(sale.router, prefix="/sales", tags=["sales"])
app.include_router(seller.router, prefix="/sellers", tags=["sellers"])
app.mount("/images", StaticFiles(directory=os.getenv("UPLOAD_DIR")), name="images")

def seed_db():
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

seed_db()