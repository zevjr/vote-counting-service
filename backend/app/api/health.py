"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    """Return API health status."""
    return {"status": "ok", "service": "BU Monitor API"}
