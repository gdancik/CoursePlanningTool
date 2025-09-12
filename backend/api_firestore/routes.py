from flask import request, jsonify, send_file
from flask_login import login_required
from datetime import datetime
import pandas as pd
import io

from backend.services.parameter_checking import require_post_params

#from backend.services.gs_editor import gsEditor
from flask_login import current_user
from backend.services.app_services import get_fs_editor
from . import api_firestore_bp
import logging


'''Calls the getValue function from the fs_editor.py module'''
@api_firestore_bp.route('getValue/', methods=['POST'])
@require_post_params('course_id', 'list_of_columns')
@login_required
def getValue():
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object')

    try:
        logging.debug('Fetching data...')
        data = request.get_json()
        course_id = data.get('course_id')        
        logging.debug(f'Fetched course_id: {course_id}')
        columns = data.get('list_of_columns')
        logging.debug(f'Fetched list_of_columns: {columns}')
        
        # Call the getValue function
        logging.info("Retrieving Value from Sheet")
        sheet = fs.getValue(course_id, columns)
        
        # Check if sheet is None
        if sheet is None:
            return jsonify({"error": "No data returned from getValue"}), 500

        # Return the result as JSON
        return jsonify(sheet)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

'''Calls the updateValue function from the fs_editor.py module'''
@api_firestore_bp.route('updateValue/', methods=['POST'])
@require_post_params('course_id', 'dict_of_columns_and_vals')
@login_required
def updateValue():
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object')
    try:
        logging.debug(f'Fetching data...')
        data = request.get_json()
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id: {course_id}')
        columns = data.get('dict_of_columns_and_vals')
        logging.debug(f'Fetched dict_of_columns_and_vals: {columns}')

        # Call the updateValue function
        logging.info("Updating a value in the google sheet")
        fs.updateValue(course_id, columns)
        return jsonify('Function called successfully')
    except Exception as e:
        return jsonify({"error": str(e)}), 500


'''Calls the delete_course function from the fs_editor.py module'''
@api_firestore_bp.route('deleteCourse/', methods=['POST'])
@require_post_params('course_id')
@login_required
def deleteCourse():
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object')
    try:
        logging.debug(f'Fetching data...')
        data = request.get_json()
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id: {course_id}')

        # Call the updateValue function
        logging.info("deleting course")
        fs.delete_course(course_id)
        return jsonify({"course_id": course_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

'''Gets the course with specified course_id'''
@api_firestore_bp.route('getCourse/', methods=['POST'])
@login_required
@require_post_params('course_id')
def getCourse():       
        data = request.get_json()
        course_id = data.get('course_id')        
               
        fs = get_fs_editor()
        res =  fs.getCourse(course_id)
        return(jsonify(res))

'''Calls the read_collection function from the fs_editor.py module'''
@api_firestore_bp.route('getSheet/', methods=['POST'])
@require_post_params()
@login_required
def getSheet():
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object for {fs.collection_name}')
    try:

        # Call the read_sheet function
        logging.info('Reading the google sheet')
        sheet = fs.read_collection(return_json = True)
       
        # Check if sheet is None
	# If sheet does not exist we will get an empty data frame, which is
	# valid for a first time user
        #if sheet is None:
        #    return jsonify({"error": "No data returned from getSheet"}), 500

        # Return the result as JSON
        return jsonify(sheet)
        #return jsonify(sheet.to_dict(orient='index'))
        
        #sheet['course_id'] = sheet.index
        #return jsonify(sheet.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


'''Calls the createNewCourse function from the fs_editor.py module'''
@api_firestore_bp.route('createNewCourse/', methods=['POST'])
@require_post_params('dict_of_columns_and_vals')
@login_required
def createNewCourse():    
    fs = get_fs_editor()
    logging.debug(f'Created gs_editor object')
    try:
        logging.debug(f'Fetching data')
        data = request.get_json()
        columns = data.get('dict_of_columns_and_vals')
        logging.debug(f'Fetched dict_of_columns_and_vals: {columns}')

        # Call the createNewCourse function
        logging.info('Calling createNewCourse function')
        courseId = fs.createNewCourse(columns)
        return jsonify({'courseId:': courseId})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

'''Calls the duplicateCourse function from the fs_editor.py module'''
@api_firestore_bp.route('duplicateCourse/', methods=['POST'])
@require_post_params('course_id')
@login_required
def duplicateCourse():
    fs = get_fs_editor()
    try:
        logging.debug(f'Fetching data')
        data = request.get_json()
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id: {course_id}')

        courseId = fs.duplicateCourse(course_id)
        return jsonify({'course_id:': courseId})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
