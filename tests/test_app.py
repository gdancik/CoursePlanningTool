# test_app.py
import sys
import os
import json

# Add the parent directory to the Python path -- required for importing from flaskr
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flaskr.app import app 

def test_index():
    tester = app.test_client()
    response = tester.get('/')
    print('response = ', response.data)
    assert response.status_code == 200

def test_hello():
    tester = app.test_client()
    response = tester.get('/api/hello')
    print('response = ', response.data)
    d = json.loads(response.text)
    assert d['message'] == 'Hello from Flask!'
