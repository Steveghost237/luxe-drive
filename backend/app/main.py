import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, routes, routes_extra, admin, messages
from sqlalchemy import text

Base.metadata.create_all(bind=engine)

# SQLite migration: add last_seen column if missing (SQLite only)
if "sqlite" in settings.DATABASE_URL.lower():
    try:
        with engine.connect() as _conn:
            _conn.execute(text("ALTER TABLE utilisateurs ADD COLUMN last_seen DATETIME"))
            _conn.commit()
    except Exception:
        pass

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Luxe Drive API",
    description="API REST — Location, chauffeur et vente de véhicules de luxe",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

_raw_origins = settings.ALLOWED_ORIGINS.strip()
if _raw_origins in ("*", '["*"]', "['*']"):
    _CORS_ORIGINS = ["*"]
else:
    _parsed = [o.strip().strip('"').strip("'") for o in _raw_origins.strip("[]").split(",")]
    _CORS_ORIGINS = list(set(_parsed + [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.91:5173",
    ]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["Authentification"])
app.include_router(routes.router, prefix="/api", tags=["Ressources"])
app.include_router(routes_extra.router, prefix="/api", tags=["Extras"])
app.include_router(admin.router, prefix="/api/admin", tags=["Administration"])
app.include_router(messages.router, prefix="/api", tags=["Messages"])


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Bienvenue sur l'API Luxe Drive",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
