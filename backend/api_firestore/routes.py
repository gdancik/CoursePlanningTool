from flask import request, jsonify, send_file
from flask_login import login_required
from datetime import datetime
import pandas as pd
import io
from backend.services.parameter_checking import require_post_params
from flask_login import current_user
from backend.services.app_services import get_fs_editor
from . import api_firestore_bp
import logging

@api_firestore_bp.route('getValue/', methods=['POST'])
@require_post_params('course_id', 'list_of_columns')
@login_required
def getValue():
    """
    Get values for specified fields for a course
    ---
    tags:
      - courses

    security:
      - cookieAuth: []

    deprecated: true

    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              course_id:
                type: string
                description: The ID of the course to retrieve values from
                example: "c2"
              list_of_columns:
                type: array
                type: string
                description: List of columns to retrieve from the course
                example: ["instructor_name_syllabus", "phone_syllabus"]

    responses:
      200:
        description: Successfully retrieved course values
        content:
          application/json:
            schema:
              type: object
              example: {"instructor_name_syllabus": "Eddie Walker", "phone_syllabus": "(123) 456-7890"}
      401:
        description: Unauthorized - user not logged in
      500:
        description: Error retrieving values
    """
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object')
    try:
        logging.debug('Fetching data...')
        data = request.get_json()
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id: {course_id}')
        columns = data.get('list_of_columns')
        logging.debug(f'Fetched list_of_columns: {columns}')

        logging.info("Retrieving Value from Sheet")
        sheet = fs.getValue(course_id, columns)

        if sheet is None:
            return jsonify({"error": "No data returned from getValue"}), 500
        return jsonify(sheet)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_firestore_bp.route('updateValue/', methods=['POST'])
@require_post_params('course_id', 'dict_of_columns_and_vals')
@login_required
def updateValue():
    """
    Update values in a course
    ---
    tags:
      - courses
    security:
      - cookieAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              course_id:
                type: string
                description: The ID of the course to update
                example: "course123"
              dict_of_columns_and_vals:
                type: object
                description: Dictionary of column-value pairs to update
                example: {"instructor_name_syllabus": "new_value1", "office_location_syllabus": "new_value2"}
    responses:
      200:
        description: Successfully updated course values
        content:
          application/json:
            schema:
              type: string
              example: "Function called successfully"
      401:
        description: Unauthorized - user not logged in
      500:
        description: Error updating values
    """
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object')
    try:
        logging.debug(f'Fetching data...')
        data = request.get_json()
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id: {course_id}')
        columns = data.get('dict_of_columns_and_vals')
        logging.debug(f'Fetched dict_of_columns_and_vals: {columns}')

        logging.info("Updating a value in the google sheet")
        fs.updateValue(course_id, columns)
        return jsonify('Function called successfully')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_firestore_bp.route('deleteCourse/', methods=['POST'])
@require_post_params('course_id')
@login_required
def deleteCourse():
    """
    Delete a course
    ---
    tags:
      - courses
    security:
      - cookieAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              course_id:
                type: string
                description: The ID of the course to delete
                example: "c2"
    responses:
      200:
        description: Successfully deleted course
        content:
          application/json:
            schema:
              type: object
              properties:
                course_id:
                  type: string
                  description: the ID of the deleted course
                  example: "course123"
      401:
        description: Unauthorized - user not logged in
      500:
        description: Error deleting course
    """
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object')
    try:
        logging.debug(f'Fetching data...')
        data = request.get_json()
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id: {course_id}')

        logging.info("Deleting course")
        fs.delete_course(course_id)
        return jsonify({"course_id": course_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_firestore_bp.route('getCourse/', methods=['POST'])
@login_required
@require_post_params('course_id')
def getCourse():
    """
    Get all data for a specific course
    ---
    tags:
      - courses
    security:
      - cookieAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              course_id:
                type: string
                description: The ID of the course to retrieve
                example: "course123"
    responses:
      200:
        description: Successfully retrieved course
        content:
          application/json:
            schema:
              type: object
              example: {"course_id": "course123", "name": "Course Name", "instructor": "Alice Jones"} 
      401:
        description: Unauthorized - user not logged in
      500:
        description: Error retrieving course
    """
    data = request.get_json()
    course_id = data.get('course_id')

    fs = get_fs_editor()
    res = fs.getCourse(course_id)
    return jsonify(res)

@api_firestore_bp.route('getSheet/', methods=['POST'])
@require_post_params()
@login_required
def getSheet():
    """
    Get all course information for the currently logged in user
    ---
    tags:
      - courses
    security:
      - cookieAuth: []
    requestBody:
      required: false
    description:  This request has no body
    responses:
      200:
        description: Successfully retrieved sheet data
        content:
          application/json:
            schema:
              type: object
              example: {
                "course1": {"column1": "value1", ...},
                "course2": {"column1": "value2", ...}
              }
      401:
        description: Unauthorized - user not logged in
      500:
        description: Error retrieving sheet data
    """
    fs = get_fs_editor()
    logging.debug(f'Created fs_editor object for {fs.collection_name}')
    try:
        logging.info('Reading the google sheet')
        sheet = fs.read_collection(return_json=True)
        return jsonify(sheet)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_firestore_bp.route('createNewCourse/', methods=['POST'])
@require_post_params('dict_of_columns_and_vals')
@login_required
def createNewCourse():
    """
    Create a new course
    ---
    tags:
      - courses

    security:
      - cookieAuth: []

    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              dict_of_columns_and_vals:
                type: object
                description: Dictionary of column-value pairs for the new course
                example: {
                  "course_title_syllabus": "Intro to Mathematics",
                  "course_description_syllabus": "A math course",
                }

    responses:
      200:
        description: Successfully created new course
        content:
          application/json:
            schema:
              type: object
              properties:
                courseId:
                  type: string
                  description: the ID of the new course
                  example: "new_course123"
      401:
        description: Unauthorized - user not logged in
      500:
        description: Error creating new course
    """
    fs = get_fs_editor()
    logging.debug(f'Created gs_editor object')
    try:
        logging.debug(f'Fetching data')
        data = request.get_json()
        columns = data.get('dict_of_columns_and_vals')
        logging.debug(f'Fetched dict_of_columns_and_vals: {columns}')

        logging.info('Calling createNewCourse function')
        courseId = fs.createNewCourse(columns)
        return jsonify({'courseId': courseId})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_firestore_bp.route('duplicateCourse/', methods=['POST'])
@require_post_params('course_id')
@login_required
def duplicateCourse():
    """
    Duplicate an existing course
    ---
    tags:
      - courses
    security:
      - cookieAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              course_id:
                type: string
                description: The ID of the course to duplicate
                example: "c2"
    responses:
      200:
        description: Successfully duplicated course
        content:
          application/json:
            schema:
              type: object
              properties:
                course_id:
                  type: string
                  description: the ID of the duplicated course
                  example: "duplicated_course123"
      401:
        description: Unauthorized - user not logged in
      500:
        description: Error duplicating course
    """
    fs = get_fs_editor()
    try:
        logging.debug(f'Fetching data')
        data = request.get_json()
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id: {course_id}')

        courseId = fs.duplicateCourse(course_id)
        return jsonify({'course_id': courseId})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
