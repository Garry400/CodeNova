# backend/create_tables.py
from app.database import Base, engine
from app.models import user  # ensure user model is imported

print("⏳ Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Done.")
