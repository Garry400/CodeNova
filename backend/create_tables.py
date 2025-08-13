# backend/create_tables.py

from app.database import Base, engine
from app.models import user  # Import all models so SQLAlchemy registers them

def create_tables():
    print("⏳ Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully.")

if __name__ == "__main__":
    create_tables()
