# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Update with your actual PostgreSQL username, password, host, port, and database name:
DATABASE_URL = "postgresql://postgres:datastore98@localhost:5432/codenova"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for your models
Base = declarative_base()

# Dependency: yield a DB session to FastAPI routes, then close it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
