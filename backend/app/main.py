"""FastAPI application entry point."""

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from alembic.config import Config
from alembic import command
from app.api import boletins, dashboard, health, results, upload
from app.core.config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

logger = logging.getLogger(__name__)


def run_migrations():
    """Applies database migrations."""
    alembic_cfg = Config("alembic.ini")
    database_url = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    alembic_cfg.set_main_option("sqlalchemy.url", database_url)
    command.upgrade(alembic_cfg, "head")
    logger.info("Alembic migrations applied.")


@asynccontextmanager
async def lifespan(app_: FastAPI):
    """FastAPI lifespan event handler to run migrations on startup."""
    logger.info("Starting up...")
    try:
        run_migrations()
    except Exception as e:
        logger.error(f"Migration failed: {e}")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for the BU Election Monitor system.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(boletins.router, prefix="/api/v1")
app.include_router(upload.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(results.router, prefix="/api/v1")

logger.info("BU Monitor API started — version %s", settings.app_version)
