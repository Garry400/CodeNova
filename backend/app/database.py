from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DATABASE_URL = "postgresql://postgres:datastore98@localhost/codenova"
DATABASE_URL="postgresql://postgres:zBcFKMAgVZgHSEwscLxWHSTZHALAxzEh@yamanote.proxy.rlwy.net:29145/railway"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()
