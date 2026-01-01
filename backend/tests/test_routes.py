import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_recommendations():
    response = client.get("/recommendations/123")
    assert response.status_code == 200 # assert function checks if the condition is true
    assert isinstance(response.json(), list) #.jason() data jason file ko python object mein convert karta hai 

def test_get_trending():
    response = client.get("/trending")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_similar_items():
    response = client.get("/similar-items/987")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

