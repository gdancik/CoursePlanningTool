import sys
import os

# Add the greatgrandparent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

import pytest
from backend.services.gs_editor import gsEditor
import backend.services.course_planning as cp

def testCreateGetUpdateDelete() :

    gs = gsEditor('test_gs_editor')

    # test name
    assert gs.sheet_name == 'test_gs_editor'

    # create sheet
    if gs.sheet_exists() :
        gs.delete_sheet()
    
    id = gs.create_sheet()

    # Create courses and update sheet
    gs.createNewCourse({'instructor_name_syllabus': 'joe', 'crse_number_syllabus': 210})
    gs.createNewCourse({'instructor_name_syllabus': 'steve', 'crse_number_syllabus': 203})
    gs.createNewCourse({'instructor_name_syllabus': 'bob', 'crse_number_syllabus': 203})
    gs.createNewCourse({'instructor_name_syllabus': 'bob', 'crse_number_syllabus': 211})
   
    df = gs.read_sheet()

    # test that column names are correct
    assert set(df.columns) == set(cp.columns)

    # test that number of rows is correct
    assert df.shape[0] == 4

    # test getValue method
    val = gs.getValue('c2', ['instructor_name_syllabus', 'crse_number_syllabus'])
    assert val == {'instructor_name_syllabus': 'steve', 'crse_number_syllabus': 203}

    # test getting a single value
    val = gs.getValue('c4', 'instructor_name_syllabus')
    assert val == 'bob'

    # test updateValue method changes a value
    gs.updateValue('c2', {'instructor_name_syllabus': 'alice'})
    
    val = gs.getValue('c2', ['instructor_name_syllabus', 'crse_number_syllabus'])
    assert val == {'instructor_name_syllabus': 'alice', 'crse_number_syllabus': 203}

    # test delete sheet and sheet_exists
    assert gs.sheet_exists() == True 

    gs.delete_sheet()
    assert gs.sheet_exists() == False 

def testGetValueNotFound() :

    # test that we get None if course id is not found
    gs = gsEditor('test_gs_editor')

    # create sheet
    if gs.sheet_exists() :
        gs.delete_sheet()
    
    gs.create_sheet()
    assert gs.getValue('c2', ['instructor_name_syllabus']) == None

    gs.delete_sheet()
