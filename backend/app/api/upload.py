"""API endpoint for BU file upload."""

import logging

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.upload import UploadedFileResponse
from app.services.bu_service import BUService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["upload"])

_MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


@router.post("", response_model=UploadedFileResponse, status_code=201)
async def upload_bu(
    file: UploadFile,
    uploaded_by: str = Form(...),
    uploaded_by_name: str = Form(...),
    db: Session = Depends(get_db),
) -> UploadedFileResponse:
    """Upload a Boletim de Urna PDF for processing.

    The file is parsed synchronously using MockBUParser.
    Vote data is persisted atomically in PostgreSQL.

    Form fields:
    - file: PDF file (multipart/form-data)
    - uploaded_by: User ID of the uploader
    - uploaded_by_name: Display name of the uploader
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    content = await file.read()

    if len(content) > _MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {_MAX_FILE_SIZE // (1024 * 1024)} MB.",
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")

    logger.info(
        "Received upload file=%s size=%d uploaded_by=%s",
        file.filename,
        len(content),
        uploaded_by,
    )

    service = BUService(db)
    result = service.upload_bu(
        file_content=content,
        file_name=file.filename,
        file_size=len(content),
        uploaded_by=uploaded_by,
        uploaded_by_name=uploaded_by_name,
    )

    return result
