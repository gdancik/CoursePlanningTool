# test_app.py
import pytest
import sys
import os
import json


# Add the parent directory to the Python path -- required for importing from backend 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app import app 


# fixture sets up client once for all tests in this file
@pytest.fixture(scope="module")
def client():
    with app.test_client() as client:
        yield client

def test_index(client):
    response = client.get('/')
    print('response = ', response.data)
    assert response.status_code == 200

# test that /api/hello/ without login is unauthorized
def test_hello(client):
    response = client.get('/api/hello/')
    print('response = ', response.status_code)
    assert response.status_code == 401

# test that /api/hi/ returns greeting
def test_hi(client):
    response = client.get('/api/hi/')
    print('response = ', response.data)
    d = json.loads(response.text)
    assert d['message'] == 'Hi there from Flask!'
