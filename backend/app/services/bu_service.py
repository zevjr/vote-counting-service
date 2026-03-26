"""Business logic service for BU processing."""

import hashlib
import logging
import tempfile
from pathlib import Path

from sqlalchemy.orm import Session

from app.parsers.base import BUParser
from app.parsers.mock_bu_parser import MockBUParser
from app.repositories.boletim_urna_repository import BoletimUrnaRepository
from app.repositories.processed_file_repository import ProcessedFileRepository
from app.repositories.vote_repository import VoteRepository
from app.schemas.boletim_urna import BoletimUrnaCreate, BoletimUrnaResponse
from app.schemas.dashboard import DashboardStats, SectionCoverage, TimelineEntry
from app.schemas.upload import UploadedFileResponse
from app.schemas.vote import CandidateResult, OfficeResult

logger = logging.getLogger(__name__)

# Default municipality for Phase 02 (single-municipality scope)
_DEFAULT_MUNICIPALITY = "Florianópolis"
_TOTAL_SECTIONS_EXPECTED = 500


class BUService:
    """Orchestrates BU upload, parsing, and data persistence.

    Follows the layered architecture: API → Service → Repository → Database.
    Business logic lives here; repositories handle all SQL.
    """

    def __init__(self, db: Session, parser: BUParser | None = None) -> None:
        self._db = db
        self._parser: BUParser = parser or MockBUParser()
        self._bu_repo = BoletimUrnaRepository(db)
        self._vote_repo = VoteRepository(db)
        self._processed_repo = ProcessedFileRepository(db)

    # ─── Upload ──────────────────────────────────────────────────────────────

    def upload_bu(
        self,
        file_content: bytes,
        file_name: str,
        file_size: int,
        uploaded_by: str,
        uploaded_by_name: str,
    ) -> UploadedFileResponse:
        """Process a BU file upload.

        Steps:
        1. Calculate SHA256 hash.
        2. Check idempotency (reject duplicates).
        3. Run MockBUParser to extract data.
        4. Persist BoletimUrna + Votes + ProcessedFile atomically.

        Args:
            file_content: Raw bytes of the uploaded PDF.
            file_name: Original file name.
            file_size: File size in bytes.
            uploaded_by: User ID of the uploader.
            uploaded_by_name: Display name of the uploader.

        Returns:
            UploadedFileResponse with processing result.
        """
        import datetime
        import uuid

        upload_id = str(uuid.uuid4())
        uploaded_at = datetime.datetime.now(datetime.UTC)

        # Step 1: Calculate SHA256 hash
        file_hash = hashlib.sha256(file_content).hexdigest()
        logger.info("Processing upload file=%s hash=%s", file_name, file_hash)

        # Step 2: Idempotency check
        if self._processed_repo.exists(file_hash):
            logger.warning("Duplicate file detected hash=%s file=%s", file_hash, file_name)
            return UploadedFileResponse(
                id=upload_id,
                file_name=file_name,
                file_size=file_size,
                status="failed",
                uploaded_at=uploaded_at,
                uploaded_by=uploaded_by,
                uploaded_by_name=uploaded_by_name,
                error_message="Arquivo duplicado. Este BU já foi processado anteriormente.",
            )

        # Step 3: Write to temp file and parse
        tmp_path: str = ""
        try:
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                tmp.write(file_content)
                tmp_path = tmp.name

            parsed = self._parser.parse(tmp_path)
            Path(tmp_path).unlink(missing_ok=True)

        except Exception as exc:
            logger.exception("Parser failed for file=%s: %s", file_name, exc)
            if tmp_path:
                Path(tmp_path).unlink(missing_ok=True)
            return UploadedFileResponse(
                id=upload_id,
                file_name=file_name,
                file_size=file_size,
                status="failed",
                uploaded_at=uploaded_at,
                uploaded_by=uploaded_by,
                uploaded_by_name=uploaded_by_name,
                error_message=f"Falha ao processar o arquivo: {exc}",
            )

        # Step 4: Check BU uniqueness (municipality + zone + section)
        existing_bu = self._bu_repo.get_by_municipality_zone_section(
            parsed.municipality, parsed.zone, parsed.section
        )
        if existing_bu is not None:
            logger.warning(
                "Duplicate BU section municipality=%s zone=%s section=%s",
                parsed.municipality,
                parsed.zone,
                parsed.section,
            )
            return UploadedFileResponse(
                id=upload_id,
                file_name=file_name,
                file_size=file_size,
                status="failed",
                uploaded_at=uploaded_at,
                uploaded_by=uploaded_by,
                uploaded_by_name=uploaded_by_name,
                municipality=parsed.municipality,
                zone=parsed.zone,
                section=parsed.section,
                error_message=(
                    f"Seção já processada: {parsed.municipality} "
                    f"Zona {parsed.zone} Seção {parsed.section}."
                ),
            )

        # Step 5: Persist atomically
        try:
            bu_data = BoletimUrnaCreate(
                municipality=parsed.municipality,
                zone=parsed.zone,
                section=parsed.section,
                file_name=file_name,
                file_hash=file_hash,
                uploaded_by=uploaded_by,
                uploaded_by_name=uploaded_by_name,
            )
            bu = self._bu_repo.create(bu_data)
            self._vote_repo.create_bulk(bu.id, parsed.votes)
            self._processed_repo.create(file_hash)
            self._bu_repo.update_status(bu, "processed")
            self._db.commit()

            logger.info(
                "BU processed successfully id=%s municipality=%s zone=%s section=%s",
                bu.id,
                bu.municipality,
                bu.zone,
                bu.section,
            )

            return UploadedFileResponse(
                id=upload_id,
                file_name=file_name,
                file_size=file_size,
                status="processed",
                uploaded_at=uploaded_at,
                uploaded_by=uploaded_by,
                uploaded_by_name=uploaded_by_name,
                municipality=parsed.municipality,
                zone=parsed.zone,
                section=parsed.section,
            )

        except Exception as exc:
            self._db.rollback()
            logger.exception("Failed to persist BU data: %s", exc)
            return UploadedFileResponse(
                id=upload_id,
                file_name=file_name,
                file_size=file_size,
                status="failed",
                uploaded_at=uploaded_at,
                uploaded_by=uploaded_by,
                uploaded_by_name=uploaded_by_name,
                error_message=f"Erro ao salvar dados: {exc}",
            )

    # ─── Boletins ────────────────────────────────────────────────────────────

    def get_boletins(self) -> list[BoletimUrnaResponse]:
        """Return all BoletimUrna records."""
        records = self._bu_repo.get_all()
        return [BoletimUrnaResponse.model_validate(r) for r in records]

    # ─── Dashboard ───────────────────────────────────────────────────────────

    def get_dashboard_stats(self) -> DashboardStats:
        """Return aggregated dashboard statistics."""
        import datetime

        counts = self._bu_repo.count_by_status()
        total_votes = self._vote_repo.get_total_votes_counted()

        return DashboardStats(
            total_sections_expected=_TOTAL_SECTIONS_EXPECTED,
            total_sections_processed=counts.get("processed", 0),
            total_sections_pending=counts.get("pending", 0) + counts.get("processing", 0),
            total_sections_failed=counts.get("failed", 0),
            total_votes_counted=total_votes,
            last_updated=datetime.datetime.now(datetime.UTC),
        )

    def get_section_coverage(self) -> SectionCoverage:
        """Return section coverage data for the default municipality."""
        counts = self._bu_repo.count_by_status()
        return SectionCoverage(
            municipality=_DEFAULT_MUNICIPALITY,
            total_sections=_TOTAL_SECTIONS_EXPECTED,
            processed_sections=counts.get("processed", 0),
            pending_sections=counts.get("pending", 0) + counts.get("processing", 0),
            failed_sections=counts.get("failed", 0),
        )

    def get_upload_timeline(self) -> list[TimelineEntry]:
        """Return upload counts grouped by hour."""
        rows = self._bu_repo.get_upload_timeline()
        return [
            TimelineEntry(hour=str(r["hour"]), count=int(str(r["count"])))
            for r in rows
        ]

    # ─── Results ─────────────────────────────────────────────────────────────

    def get_aggregated_results(self) -> list[OfficeResult]:
        """Return aggregated vote results by office."""
        raw = self._vote_repo.get_aggregated_results()
        results: list[OfficeResult] = []
        for item in raw:
            candidates_raw = item["candidates"]
            assert isinstance(candidates_raw, list)
            results.append(
                OfficeResult(
                    office=str(item["office"]),
                    candidates=[
                        CandidateResult(
                            number=str(c["number"]),
                            name=str(c["name"]),
                            party=str(c["party"]) if c.get("party") else None,
                            votes=int(str(c["votes"])),
                        )
                        for c in candidates_raw
                    ],
                )
            )
        return results
