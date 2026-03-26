"""Pydantic schemas for dashboard and progress endpoints."""

import datetime

from pydantic import BaseModel


class DashboardStats(BaseModel):
    """Aggregated statistics for the dashboard."""

    total_sections_expected: int
    total_sections_processed: int
    total_sections_pending: int
    total_sections_failed: int
    total_votes_counted: int
    last_updated: datetime.datetime


class SectionCoverage(BaseModel):
    """Section coverage data per municipality."""

    municipality: str
    total_sections: int
    processed_sections: int
    pending_sections: int
    failed_sections: int


class TimelineEntry(BaseModel):
    """Upload count per hour."""

    hour: str
    count: int
