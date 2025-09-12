import sys
import os

# Add the greatgrandparent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

import pytest
from backend.services.firestore_editor import fsEditor
import backend.services.course_planning as cp

@pytest.fixture(scope="session")
def firebase_app():
    # Initialize your Firebase app here
    # Ensure this initialization happens only once
    fs_editor = fsEditor('test_fs_editor')
    yield fs_editor
# Use the session fixture in your tests
@pytest.fixture
def fs(firebase_app):
    return firebase_app

def testCreateGetUpdateDelete(fs) :

    # test name
    assert fs.collection_name == 'test_fs_editor'

    # create sheet
    if fs.collection_exists():
        fs.delete_collection()
    
    # Create courses and update sheet
    c1 = fs.createNewCourse({'instructor_name_syllabus': 'joe', 'crse_number_syllabus': 210})
    c2 = fs.createNewCourse({'instructor_name_syllabus': 'steve', 'crse_number_syllabus': 203})
    c3 = fs.createNewCourse({'instructor_name_syllabus': 'bob', 'crse_number_syllabus': 203})
    c4 = fs.createNewCourse({'instructor_name_syllabus': 'bob', 'crse_number_syllabus': 211})
   
    df = fs.read_collection()

    # test that number of rows is correct
    assert df.shape[0] == 4

    # test getValue method
    val = fs.getValue(c2, ['instructor_name_syllabus', 'crse_number_syllabus'])
    assert val == {'instructor_name_syllabus': 'steve', 'crse_number_syllabus': 203}

    # test getting a single value
    val = fs.getValue(c4, 'instructor_name_syllabus')
    assert val == 'bob'

    # test updateValue method changes a value
    fs.updateValue(c2, {'instructor_name_syllabus': 'alice'})
    
    val = fs.getValue(c2, ['instructor_name_syllabus', 'crse_number_syllabus'])
    assert val == {'instructor_name_syllabus': 'alice', 'crse_number_syllabus': 203}

    # test delete sheet and sheet_exists
    assert fs.collection_exists() == True 

    fs.delete_collection()
    assert fs.collection_exists() == False 

def testGetValueNotFound(fs) :

    # create sheet
    if fs.collection_exists() :
        fs.delete_collection()
    
    c1 = fs.createNewCourse({'crse_number_syllabus': 210})
    assert fs.getValue('c2', ['instructor_name_syllabus']) == None

    fs.delete_collection()
