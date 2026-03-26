"""API endpoints for Boletim de Urna listing."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.boletim_urna import BoletimUrnaResponse
from app.services.bu_service import BUService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/boletins", tags=["boletins"])


@router.get("", response_model=list[BoletimUrnaResponse])
def list_boletins(db: Session = Depends(get_db)) -> list[BoletimUrnaResponse]:
    """Return all Boletins de Urna with their processing status."""
    service = BUService(db)
    return service.get_boletins()
