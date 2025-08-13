from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth

# Create FastAPI app
app = FastAPI(title="CodeNova Backend")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
# NOTE: In auth.py you already have `router = APIRouter(prefix="/auth")`
# so we don't add another prefix here.
app.include_router(auth.router)

# Health check endpoint
@app.get("/")
def root():
    return {"message": "CodeNova Backend is Running 🚀"}

@app.get("/ping")
def ping():
    return {"message": "Pong from FastAPI 🔥"}
