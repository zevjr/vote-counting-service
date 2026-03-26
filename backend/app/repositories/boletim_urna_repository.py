"""Repository for BoletimUrna database operations."""

import logging

from sqlalchemy.orm import Session

from app.models.boletim_urna import BoletimUrna
from app.schemas.boletim_urna import BoletimUrnaCreate

logger = logging.getLogger(__name__)


class BoletimUrnaRepository:
    """Encapsulates all database operations for BoletimUrna."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_all(self) -> list[BoletimUrna]:
        """Return all BoletimUrna records ordered by creation date descending."""
        return self._db.query(BoletimUrna).order_by(BoletimUrna.created_at.desc()).all()

    def get_by_id(self, bu_id: int) -> BoletimUrna | None:
        """Return a BoletimUrna by its primary key."""
        return self._db.query(BoletimUrna).filter(BoletimUrna.id == bu_id).first()

    def get_by_municipality_zone_section(
        self, municipality: str, zone: int, section: int
    ) -> BoletimUrna | None:
        """Return a BoletimUrna matching the unique combination."""
        return (
            self._db.query(BoletimUrna)
            .filter(
                BoletimUrna.municipality == municipality,
                BoletimUrna.zone == zone,
                BoletimUrna.section == section,
            )
            .first()
        )

    def create(self, data: BoletimUrnaCreate) -> BoletimUrna:
        """Insert a new BoletimUrna record."""
        bu = BoletimUrna(
            municipality=data.municipality,
            zone=data.zone,
            section=data.section,
            file_name=data.file_name,
            file_hash=data.file_hash,
            uploaded_by=data.uploaded_by,
            uploaded_by_name=data.uploaded_by_name,
            status="pending",
        )
        self._db.add(bu)
        self._db.flush()
        logger.info(
            "Created BoletimUrna id=%s municipality=%s zone=%s section=%s",
            bu.id,
            bu.municipality,
            bu.zone,
            bu.section,
        )
        return bu

    def update_status(
        self,
        bu: BoletimUrna,
        status: str,
        error_message: str | None = None,
        municipality: str | None = None,
        zone: int | None = None,
        section: int | None = None,
    ) -> BoletimUrna:
        """Update the processing status of a BoletimUrna."""
        bu.status = status
        if error_message is not None:
            bu.error_message = error_message
        if municipality is not None:
            bu.municipality = municipality
        if zone is not None:
            bu.zone = zone
        if section is not None:
            bu.section = section
        self._db.flush()
        return bu

    def count_by_status(self) -> dict[str, int]:
        """Return counts grouped by status."""
        from sqlalchemy import func

        rows = (
            self._db.query(BoletimUrna.status, func.count(BoletimUrna.id))
            .group_by(BoletimUrna.status)
            .all()
        )
        return {status: count for status, count in rows}

    def get_upload_timeline(self) -> list[dict[str, object]]:
        """Return upload counts grouped by hour (last 24 hours).

        Uses SQLAlchemy ORM to remain database-agnostic (works with both
        PostgreSQL in production and SQLite in tests).
        """
        import datetime

        from sqlalchemy import func

        cutoff = datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=24)

        rows = (
            self._db.query(
                func.strftime("%H:%M", BoletimUrna.created_at).label("hour"),
                func.count(BoletimUrna.id).label("count"),
            )
            .filter(BoletimUrna.created_at >= cutoff)
            .group_by(func.strftime("%H:%M", BoletimUrna.created_at))
            .order_by(func.strftime("%H:%M", BoletimUrna.created_at))
            .all()
        )

        return [{"hour": row.hour or "00:00", "count": row.count} for row in rows]
