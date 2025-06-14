import sys
import os

# Add the parent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Add the backend directory to the Python path -- required for local imports in module 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/')))

import pytest
from backend.gs_editor import gsEditor
import backend.course_planning as cp

def testCreateGetUpdateDelete() :

    gs = gsEditor('test_gs_editor')

    # test name
    assert gs.sheet_name == 'test_gs_editor'

    # create sheet
    if gs.sheet_exists() :
        gs.delete_sheet()
    
    id = gs.create_sheet()

    # update sheet
    gs.updateValue('id1', {'instructor_name_syllabus': 'joe', 'crse_number_syllabus': 210})
    gs.updateValue('id2', {'instructor_name_syllabus': 'steve', 'crse_number_syllabus': 203})
    gs.updateValue('id3', {'instructor_name_syllabus': 'bob', 'crse_number_syllabus': 203})
    gs.updateValue('id4', {'instructor_name_syllabus': 'bob', 'crse_number_syllabus': 211})
    
    df = gs.read_sheet()

    # test that column names are correct
    assert set(df.columns) == set(cp.columns)

    # test that number of rows is correct
    assert df.shape[0] == 4

    # test getValue method
    val = gs.getValue('id2', ['instructor_name_syllabus', 'crse_number_syllabus'])
    assert val == {'instructor_name_syllabus': 'steve', 'crse_number_syllabus': 203}

    # test getting a single value
    val = gs.getValue('id4', 'instructor_name_syllabus')
    assert val == 'bob'

    # test updateValue method changes a value
    gs.updateValue('id2', {'instructor_name_syllabus': 'alice'})
    
    val = gs.getValue('id2', ['instructor_name_syllabus', 'crse_number_syllabus'])
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
    assert gs.getValue('id2', ['instructor_name_syllabus']) == None

    gs.delete_sheet()
