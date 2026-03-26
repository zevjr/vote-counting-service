"""Pydantic schemas for BoletimUrna."""

import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

ProcessingStatus = Literal["pending", "processing", "processed", "failed"]


class BoletimUrnaBase(BaseModel):
    """Shared fields for BoletimUrna schemas."""

    municipality: str
    zone: int
    section: int
    file_name: str


class BoletimUrnaCreate(BoletimUrnaBase):
    """Schema for creating a BoletimUrna record."""

    file_hash: str | None = None
    uploaded_by: str | None = None
    uploaded_by_name: str | None = None


class BoletimUrnaResponse(BoletimUrnaBase):
    """Schema for returning a BoletimUrna record."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    file_hash: str | None = None
    s3_key: str | None = None
    status: ProcessingStatus
    error_message: str | None = None
    uploaded_by: str | None = None
    uploaded_by_name: str | None = None
    created_at: datetime.datetime
