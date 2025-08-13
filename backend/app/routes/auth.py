# backend/app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Config
SECRET_KEY = os.getenv("SECRET_KEY", "codenova-secret")  # Use env var in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ----------- Request Models -----------

class RegisterRequest(BaseModel):
    fullName: str
    accountType: str
    email: EmailStr
    password: str

from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    accountType: str  # "student" or "faculty"


# ----------- JWT Helper -----------

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ----------- Routes -----------

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user with provided email exists
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pw = pwd_context.hash(data.password)

    # Create new user
    new_user = User(
        full_name=data.fullName,
        account_type=data.accountType,
        email=data.email,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Check account type
    if user.account_type.lower() != data.accountType.lower():
        raise HTTPException(status_code=401, detail="Account type mismatch")

    # Create access token (also include accountType in payload)
    access_token = create_access_token({
        "sub": user.email,
        "accountType": user.account_type
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
