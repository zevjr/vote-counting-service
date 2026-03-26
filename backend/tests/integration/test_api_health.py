"""Integration tests for the health check endpoint."""


def test_health_check(client) -> None:
    """GET /health must return 200 with status ok."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data
