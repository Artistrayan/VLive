from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.database import engine, Base
from app.config import settings

from app.users import router as users_router
from app.streams import router as streams_router
from app.chat import router as chat_router
from app.wallet import router as wallet_router
from app.booking import router as booking_router
from app.admin import router as admin_router

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full Production Backend API for V.Live+18 Telegram Web Mini App & Android Application",
    version="2.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to create database tables
@app.on_event("startup")
def startup_db_event():
    Base.metadata.create_all(bind=engine)

# Root endpoint
@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "app_name": settings.PROJECT_NAME,
        "mode": "Telegram Mini App & Mobile API Backend",
        "version": "2.0.0"
    }

# Include Routers
app.include_router(users_router)
app.include_router(streams_router)
app.include_router(chat_router)
app.include_router(wallet_router)
app.include_router(booking_router)
app.include_router(admin_router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
