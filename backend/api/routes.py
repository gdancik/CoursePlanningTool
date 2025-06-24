from flask import request, jsonify, send_file
from flask_login import login_required
from docx import Document
from datetime import datetime
import pandas as pd
import io

from backend.services.doc_editor import replaceTextInParagraph, removeBlocks
from backend.services.course_calendar import create_schedule
import backend.services.course_planning as cp

#from backend.services.gs_editor import gsEditor
from backend.services.app_services import get_gs_editor

from . import api_bp

def missing_params(param_list) :
    '''
    Returns True if any item in the param_list is None.
    This is useful for checkign whether required request parameters
    have been specified.
    '''
    if type(param_list) != list :
        raise Exception('param_list must be a list in missing_params')
    
    return any(x == None for x in param_list)


''' Preview syllabus '''
@api_bp.route('preview/', methods=['POST'])
#@login_required
def preview():
    gs = get_gs_editor()
   
    # Get params for the request and get course ID
    try:
        data = request.get_json()
        course_id = data.get('course_id')
        # #test previewing from homepage
        # course_id = request.args['id']
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # return jsonify({"result": course_id}), 200

    #Use course_id to pull values of syllabus from the googles sheet
    try:
        fr = gs.getValue(course_id, cp.columns)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # If the key ends is _syllabus then add it to our new dictonary
    # then remove the _syllabus from the key
    ns = {}
    ns = {key[:-9]: value for key, value in fr.items() if key.endswith('_syllabus')}

    #return jsonify({"result": "created ns"}), 200

    # try local file, otherwise try full path for PythonAnywhere
    try :
        path = "backend/docx/SyllabusTemplate.docx"
        doc = Document(path)
    except :

        try :
            path = "/home/gdancik/CoursePlanningTool/backend/docx/SyllabusTemplate.docx"
            doc = Document(path)
        except :
            return jsonify({"error": "could not open Syllabus Template"}), 500

    
    #return jsonify({"result": "created doc"}), 200

    #call functions to replace
    replaceTextInParagraph(doc, ns)
    removeBlocks(doc,['time2'])
    

    # Save to a BytesIO stream
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)

    current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M")

    title =""
    title += str(ns.get('subj_code', None))
    title += str(ns.get('crse_number',None))
    title += "_" + str(ns.get('term',None))
    title += "_" + current_datetime
    
    return send_file(
        file_stream,
        as_attachment=True,
        download_name=f"{title}.docx",
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

'''Calls the getValue function from the gs_editor.py module'''
@api_bp.route('getValue/', methods=['POST'])
@login_required
def getValue():
    gs = get_gs_editor()
    try:
        data = request.get_json()
        course_id = data.get('course_id')
        columns = data.get('list_of_columns')
        if not course_id or not columns:
            return jsonify({"error": "Missing one or more required fields"}), 400

        # Call the getValue function
        sheet = gs.getValue(course_id, columns,)
        
        # Check if sheet is None
        if sheet is None:
            return jsonify({"error": "No data returned from getValue"}), 500

        # Return the result as JSON
        return jsonify(sheet)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

'''Calls the updateValue function from the gs_editor.py module'''
@api_bp.route('updateValue/', methods=['POST'])
@login_required
def updateValue():
    gs = get_gs_editor()
    try:
        data = request.get_json()
        course_id = data.get('course_id')
        columns = data.get('dict_of_columns_and_vals')

        if not course_id or not columns:
            return jsonify({"error": "Missing one or more required fields"}), 400

        # Call the updateValue function
        gs.updateValue(course_id, columns)
        return jsonify('Function called successfully')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('getCourses/', methods=['POST'])
@login_required
def getCourses():
        data = request.get_json()
        user_id = data.get('user')
        
        if not user_id:
            return jsonify({"error": "Missing one or more required fields"}), 400


        df = pd.DataFrame({'a': [1,2,3],
                           'b': [4,9,20]})
        
        return jsonify(df.to_dict(orient = 'records'))

@api_bp.route('getNewCourseId/', methods=['POST'])
@login_required
def getNewCourseId():
        data = request.get_json()
        user_id = data.get('user')
        
        if not user_id:
            return jsonify({"error": "Missing one or more required fields"}), 400

        return jsonify(course_id = '4')

'''Calls the read_sheet function from the gs_editor.py module'''
@api_bp.route('getSheet/', methods=['POST'])
@login_required
def getSheet():
    gs = get_gs_editor()
    try:

        # Call the read_sheet function
        sheet = gs.read_sheet()

        # Check if sheet is None
        if sheet is None:
            return jsonify({"error": "No data returned from getSheet"}), 500

        # Return the result as JSON
        return jsonify(sheet.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('generateSchedule/', methods=['POST'])
#@login_required
def generateSchedule():
    
    try:
        data = request.get_json()                
        term = data.get('term')
        year = data.get('year')
        days = data.get('days')

        if missing_params([term, year, days]) :
            return jsonify({"error": 
                            "At least one required parameter is missing. Term, year, and days are required"}), 400

        if term not in ['Fall', 'Spring'] :
            return jsonify({"error": "term must be Fall or Spring"}), 400

        schedule = create_schedule(term, year, days, url = 'https://www.easternct.edu/academics/academic-calendar/index.html')

        return jsonify({'schedule': schedule.to_dict(orient = 'records')})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

'''Calls the createNewCourse function from the gs_editor.py module'''
@api_bp.route('createNewCourse/', methods=['POST'])
@login_required
def createNewCourse():
    gs = get_gs_editor()
    try:
        data = request.get_json()
        columns = data.get('dict_of_columns_and_vals')

        if not columns:
            return jsonify({"error": "Missing one or more required fields"}), 400

        # Call the createNewCourse function
        gs.createNewCourse(columns)
        return jsonify('Function called successfully')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
