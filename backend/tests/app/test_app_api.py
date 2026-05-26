# test_app_api.py
import pytest
import sys
import os
import json

# Add the grandparent directory to the Python path -- required for importing from backend 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from backend import create_app
from backend.services.app_services import get_fs_editor


# fixture sets up client once for all tests in this file
@pytest.fixture(scope="module")
def client():
    with create_app().test_client() as client:
        # login in user
        client.get('/api/test_login/?user=test_app_api&password=password')        
        #setup_test_sheet()
        yield client
        

'''
Functions for setting up and deleting the test sheet
'''
@pytest.fixture(scope="module")
def setup_test_sheet():
    gs = get_fs_editor()
    print("creating new courses with collection " + gs.collection_name)
    course_id1 = gs.createNewCourse({'instructor_name_syllabus': 'Test Instructor1', 'subj_code_syllabus': 'Test Subject1','crse_number_syllabus': 'Test Number1'})    
    course_id2 = gs.createNewCourse({'instructor_name_syllabus': 'Billy', 'subj_code_syllabus': 'COM','crse_number_syllabus': '101'})    

    yield [course_id1, course_id2]

    gs.delete_collection()
   

## This test checks the /getValue/ endpoint to ensure it returns the expected data
def test_getValue(client, setup_test_sheet):
    # Define the test data

    test_data = {
        "course_id": setup_test_sheet[0],
        "list_of_columns": ['instructor_name_syllabus', 'subj_code_syllabus', 'crse_number_syllabus']
    }

    # Send a POST request to the /getValue/ endpoint
    response = client.post('/api/getValue/', json=test_data)

    # Print the response data for debugging purposes
    print('Response data:', response.data)

    # Assert that the response status code is 200 (or the appropriate success code)
    assert response.status_code == 200
    # Assert the content of the response
    response_data = json.loads(response.data)
    assert response_data['instructor_name_syllabus'] == 'Test Instructor1'
    assert response_data['subj_code_syllabus'] == 'Test Subject1'
    assert response_data['crse_number_syllabus'] == 'Test Number1'

## This tests the /getValue/ endpoint when missing course_id
def test_getValue_bad_params(client):
   
    # Send a POST request with missing course_id
    response = client.post('/api/getValue/', json={'a':1})
    assert response.status_code == 400
    response_data = json.loads(response.data)
    assert response_data['error'] == "Missing required parameter: course_id"

    # Send a POST request with invalid column
    response = client.post('/api/getValue/', json={'course_id': 1, 
                                                   'list_of_columns': ['bad_param']})
    assert response.status_code == 400
    response_data = json.loads(response.data)
    assert response_data['error'] == "list_of_columns has invalid field: bad_param"

## This test checks the /updateValue/ endpoint to ensure it updates the data successfully
def test_updateValue_success(client, setup_test_sheet):
    # Define the test data for a successful request
    test_data = {
        "course_id": setup_test_sheet[0],
        "dict_of_columns_and_vals": {'instructor_name_syllabus': 'Dr. Smith', 'subj_code_syllabus': 'Math'}        
    }

    # Send a POST request to the /updateValue/ endpoint
    response = client.post('/api/updateValue/', json=test_data)

    # Print the response data for debugging purposes
    print('Response data:', response.data)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Assert the content of the response
    assert b'Function called successfully' in response.data

def test_preview(client, setup_test_sheet):
    # Define the test data for a successful request
    test_data = {
        "course_id":setup_test_sheet[0],
    }

    # Send a POST request to the /preview/ endpoint
    response = client.post('/api/preview/', json=test_data)

    # Print the response data for debugging purposes
    print('Response data:', response.data)

    # Assert that the response status code is 200
    assert response.status_code == 200

def test_generate_schedule_success(client):
    # Define valid test data
    test_data = {
        "term": "Fall",
        "year": '2025',
        "days": 'MWF'
    }

    # Send a POST request to the /generateSchedule/ endpoint
    response = client.post('/api/generateSchedule/', json=test_data)

    # Print the response data for debugging purposes
    print('Response data:', response.data)

    # Assert that the response status code is 200
    assert response.status_code == 200
    # Assert the content of the response
    assert b'schedule' in response.data


