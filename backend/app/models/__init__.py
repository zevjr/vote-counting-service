"""SQLAlchemy models package. Import all models here so Alembic can detect them."""

from app.models.boletim_urna import BoletimUrna
from app.models.processed_file import ProcessedFile
from app.models.vote import Vote

__all__ = ["BoletimUrna", "Vote", "ProcessedFile"]
