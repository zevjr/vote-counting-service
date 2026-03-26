"""Repository for ProcessedFile database operations."""

import logging

from sqlalchemy.orm import Session

from app.models.processed_file import ProcessedFile

logger = logging.getLogger(__name__)


class ProcessedFileRepository:
    """Encapsulates all database operations for ProcessedFile."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def exists(self, file_hash: str) -> bool:
        """Return True if the file hash has already been processed."""
        return (
            self._db.query(ProcessedFile)
            .filter(ProcessedFile.file_hash == file_hash)
            .first()
            is not None
        )

    def create(self, file_hash: str) -> ProcessedFile:
        """Record a file hash as processed."""
        record = ProcessedFile(file_hash=file_hash)
        self._db.add(record)
        self._db.flush()
        logger.info("Recorded processed file hash=%s", file_hash)
        return record
