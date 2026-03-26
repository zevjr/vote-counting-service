"""Integration tests for dashboard and results API endpoints."""

import io


def test_dashboard_stats_empty(client) -> None:
    """GET /api/v1/dashboard/stats must return zeros when no BUs exist."""
    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_sections_processed"] == 0
    assert data["total_sections_pending"] == 0
    assert data["total_sections_failed"] == 0
    assert data["total_votes_counted"] == 0
    assert "total_sections_expected" in data
    assert "last_updated" in data


def test_section_coverage_empty(client) -> None:
    """GET /api/v1/dashboard/coverage must return coverage data."""
    response = client.get("/api/v1/dashboard/coverage")
    assert response.status_code == 200
    data = response.json()
    assert "municipality" in data
    assert "total_sections" in data
    assert data["processed_sections"] == 0


def test_upload_timeline_empty(client) -> None:
    """GET /api/v1/dashboard/timeline must return empty list when no BUs exist."""
    response = client.get("/api/v1/dashboard/timeline")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_results_empty(client) -> None:
    """GET /api/v1/results must return empty list when no votes exist."""
    response = client.get("/api/v1/results")
    assert response.status_code == 200
    assert response.json() == []


def test_dashboard_stats_after_upload(client) -> None:
    """Dashboard stats must reflect processed BU after upload."""
    pdf_content = b"%PDF-1.4 dashboard test content"
    client.post(
        "/api/v1/upload",
        files={"file": ("BU_test.pdf", io.BytesIO(pdf_content), "application/pdf")},
        data={"uploaded_by": "user-001", "uploaded_by_name": "Test User"},
    )

    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_sections_processed"] == 1
    assert data["total_votes_counted"] > 0


def test_results_after_upload(client) -> None:
    """Results endpoint must return vote data after a BU is uploaded."""
    pdf_content = b"%PDF-1.4 results test content"
    client.post(
        "/api/v1/upload",
        files={"file": ("BU_results.pdf", io.BytesIO(pdf_content), "application/pdf")},
        data={"uploaded_by": "user-001", "uploaded_by_name": "Test User"},
    )

    response = client.get("/api/v1/results")
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0

    # Each result must have office and candidates
    for office_result in results:
        assert "office" in office_result
        assert "candidates" in office_result
        assert len(office_result["candidates"]) > 0

        for candidate in office_result["candidates"]:
            assert "number" in candidate
            assert "name" in candidate
            assert "votes" in candidate
            assert candidate["votes"] > 0
