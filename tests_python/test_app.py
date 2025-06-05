# test_app.py
import pytest
import sys
import os
import json


# Add the parent directory to the Python path -- required for importing from backend 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Add the backend directory to the Python path -- required for local imports in app 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/')))

from backend.app import app 
from backend.gs_editor import gsEditor

# fixture sets up client once for all tests in this file
@pytest.fixture(scope="module")
def client():
    with app.test_client() as client:
        #setup_test_sheet()
        yield client
        #delete_test_sheet()

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

'''
def setup_test_sheet():
    gs = gsEditor('Test_Sheet1')
    gs.create_sheet()
    gs.updateValue('id_1', {'instructor_name_syllabus': 'Test Instructor1', 'crse_subj_syllabus': 'Test Subject1','crse_number_syllabus': 'Test Number1'})
    gs.updateValue('id_2', {'instructor_name_syllabus': 'Test Instructor2', 'crse_subj_syllabus': 'Test Subject2','crse_number_syllabus': 'Test Number2'})
    gs.updateValue('id_3', {'instructor_name_syllabus': 'Test Instructor3', 'crse_subj_syllabus': 'Test Subject3','crse_number_syllabus': 'Test Number3'})
    gs.updateValue('id_4', {'instructor_name_syllabus': 'Billy', 'crse_subj_syllabus': 'COM','crse_number_syllabus': '101'})
    gs.updateValue('id_5', {'instructor_name_syllabus': 'Test Instructor5', 'crse_subj_syllabus': 'Test Subject5','crse_number_syllabus': 'Test Number5'})

def delete_test_sheet():
    gs = gsEditor('Test_Sheet1')
    gs.delete_sheet()

## This test checks the /getValue/ endpoint to ensure it returns the expected data
def test_getValue(client):
    # Define the test data
    test_data = {
        "course_id": "id_2",
        "list_of_columns": ['instructor_name_syllabus', 'crse_subj_syllabus', 'crse_number_syllabus'],
        'sheet_name':'Test_Sheet1'
    }

    # Send a POST request to the /getValue/ endpoint
    response = client.post('/getValue/', json=test_data)

    # Print the response data for debugging purposes
    print('Response data:', response.data)

    # Assert that the response status code is 200 (or the appropriate success code)
    assert response.status_code == 200
    # Assert the content of the response
    response_data = json.loads(response.data)
    assert response_data['instructor_name_syllabus'] == 'Test Instructor2'
    assert response_data['crse_subj_syllabus'] == 'Test Subject2'
    assert response_data['crse_number_syllabus'] == 'Test Number2'

## This tests the /getValue/ endpoint for missing fields
def test_getValue_missing_fields(client):
    # Define the test data with missing fields
    test_data_missing_course_id = {
        "list_of_columns": ['instructor_name_syllabus', 'crse_subj_syllabus'],
        'sheet_name':'Test_Sheet1'
    }

    test_data_missing_columns = {
        "course_id": "id_2",
        'sheet_name':'Test_Sheet1'
    }

    # Send a POST request with missing course_id
    response = client.post('/getValue/', json=test_data_missing_course_id)
    assert response.status_code == 400
    response_data = json.loads(response.data)
    assert response_data['error'] == "Missing one or more required fields"

    # Send a POST request with missing columns
    response = client.post('/getValue/', json=test_data_missing_columns)
    assert response.status_code == 400
    response_data = json.loads(response.data)
    assert response_data['error'] == "Missing one or more required fields"

## This test checks the /updateValue/ endpoint to ensure it updates the data successfully
def test_updateValue_success(client):
    # Define the test data for a successful request
    test_data = {
        "course_id": "id_2",
        "list_of_columns": {'instructor_name_syllabus': 'Dr. Smith', 'crse_subj_syllabus': 'Math'},
        'sheet_name':'Test_Sheet1'
    }

    # Send a POST request to the /updateValue/ endpoint
    response = client.post('/updateValue/', json=test_data)

    # Print the response data for debugging purposes
    print('Response data:', response.data)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Assert the content of the response
    assert b'Function called successfully' in response.data

## This tests the /updateValue/ endpoint for missing fields
def test_updateValue_missing_fields(client):
    # Define test data with missing fields
    test_data_missing_course_id = {
        "list_of_columns": {'instructor_name_syllabus': 'Dr. Smith'},
        'sheet_name':'Test_Sheet1'
    }

    test_data_missing_columns = {
        "course_id": "id_2",
        'sheet_name':'Test_Sheet1'
    }

    # Send a POST request with missing course_id
    response = client.post('/updateValue/', json=test_data_missing_course_id)
    assert response.status_code == 400
    response_data = json.loads(response.data)
    assert response_data['error'] == "Missing one or more required fields"

    # Send a POST request with missing columns
    response = client.post('/updateValue/', json=test_data_missing_columns)
    assert response.status_code == 400
    response_data = json.loads(response.data)
    assert response_data['error'] == "Missing one or more required fields"

'''