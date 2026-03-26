"""Pydantic schemas for file upload."""

import datetime
from typing import Literal

from pydantic import BaseModel

ProcessingStatus = Literal["pending", "processing", "processed", "failed"]


class UploadedFileResponse(BaseModel):
    """Schema returned after a BU file upload."""

    id: str
    file_name: str
    file_size: int
    status: ProcessingStatus
    uploaded_at: datetime.datetime
    uploaded_by: str
    uploaded_by_name: str
    municipality: str | None = None
    zone: int | None = None
    section: int | None = None
    error_message: str | None = None
