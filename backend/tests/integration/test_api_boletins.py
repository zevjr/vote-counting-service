"""Integration tests for the boletins API endpoints."""

import io


def test_list_boletins_empty(client) -> None:
    """GET /api/v1/boletins must return empty list when no BUs exist."""
    response = client.get("/api/v1/boletins")
    assert response.status_code == 200
    assert response.json() == []


def test_upload_and_list_boletins(client) -> None:
    """After uploading a BU, it must appear in the boletins list."""
    pdf_content = b"%PDF-1.4 fake pdf content for testing"
    response = client.post(
        "/api/v1/upload",
        files={"file": ("BU_107_001.pdf", io.BytesIO(pdf_content), "application/pdf")},
        data={"uploaded_by": "user-001", "uploaded_by_name": "Test User"},
    )
    assert response.status_code == 201
    upload_data = response.json()
    assert upload_data["status"] == "processed"
    assert upload_data["file_name"] == "BU_107_001.pdf"

    # Now list boletins
    list_response = client.get("/api/v1/boletins")
    assert list_response.status_code == 200
    boletins = list_response.json()
    assert len(boletins) == 1
    assert boletins[0]["status"] == "processed"
    assert boletins[0]["municipality"] == "Florianópolis"


def test_upload_duplicate_file_rejected(client) -> None:
    """Uploading the same file twice must reject the second upload."""
    pdf_content = b"%PDF-1.4 duplicate test content"

    # First upload
    response1 = client.post(
        "/api/v1/upload",
        files={"file": ("BU_107_002.pdf", io.BytesIO(pdf_content), "application/pdf")},
        data={"uploaded_by": "user-001", "uploaded_by_name": "Test User"},
    )
    assert response1.status_code == 201
    assert response1.json()["status"] == "processed"

    # Second upload with same content (same hash)
    response2 = client.post(
        "/api/v1/upload",
        files={"file": ("BU_107_002.pdf", io.BytesIO(pdf_content), "application/pdf")},
        data={"uploaded_by": "user-001", "uploaded_by_name": "Test User"},
    )
    assert response2.status_code == 201
    data2 = response2.json()
    assert data2["status"] == "failed"
    assert "duplicado" in data2["error_message"].lower()


def test_upload_non_pdf_rejected(client) -> None:
    """Uploading a non-PDF file must return 400."""
    response = client.post(
        "/api/v1/upload",
        files={"file": ("document.txt", io.BytesIO(b"not a pdf"), "text/plain")},
        data={"uploaded_by": "user-001", "uploaded_by_name": "Test User"},
    )
    assert response.status_code == 400


def test_upload_empty_file_rejected(client) -> None:
    """Uploading an empty file must return 400."""
    response = client.post(
        "/api/v1/upload",
        files={"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")},
        data={"uploaded_by": "user-001", "uploaded_by_name": "Test User"},
    )
    assert response.status_code == 400
