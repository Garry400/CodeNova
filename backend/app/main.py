from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ⏬ Define FastAPI instance first
app = FastAPI()

# ⏬ CORS config (optional but recommended for frontend-backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or use ["http://localhost:5173"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⏬ Then import routers and use `app`
from app.routes import auth

app.include_router(auth.router, prefix="/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": "CodeNova Backend is Running 🚀"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or "*" for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"message": "Pong from FastAPI 🔥"}
