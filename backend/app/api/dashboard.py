"""API endpoints for dashboard statistics and progress monitoring."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.dashboard import DashboardStats, SectionCoverage, TimelineEntry
from app.services.bu_service import BUService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)) -> DashboardStats:
    """Return aggregated dashboard statistics."""
    service = BUService(db)
    return service.get_dashboard_stats()


@router.get("/coverage", response_model=SectionCoverage)
def get_section_coverage(db: Session = Depends(get_db)) -> SectionCoverage:
    """Return section coverage data for the municipality."""
    service = BUService(db)
    return service.get_section_coverage()


@router.get("/timeline", response_model=list[TimelineEntry])
def get_upload_timeline(db: Session = Depends(get_db)) -> list[TimelineEntry]:
    """Return upload counts grouped by hour (last 24 hours)."""
    service = BUService(db)
    return service.get_upload_timeline()
