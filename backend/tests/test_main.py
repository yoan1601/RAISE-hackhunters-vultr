from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI backend is running"}
