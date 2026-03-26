"""API endpoints for election results."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.vote import OfficeResult
from app.services.bu_service import BUService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/results", tags=["results"])


@router.get("", response_model=list[OfficeResult])
def get_aggregated_results(db: Session = Depends(get_db)) -> list[OfficeResult]:
    """Return aggregated vote results grouped by office and candidate."""
    service = BUService(db)
    return service.get_aggregated_results()
