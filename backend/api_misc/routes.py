from flask import request, jsonify, send_file
from flask_login import login_required
from docx import Document
from datetime import datetime
import pandas as pd
import io

from backend.services.syllabus_generator import generate_syllabus
from backend.services.course_calendar import create_schedule
from backend.services.parameter_checking import require_post_params
import backend.services.course_planning as cp

#from backend.services.gs_editor import gsEditor
from flask_login import current_user
from . import api_misc_bp
import logging

'''Gets valid inputs 
    type = 'raw', 'all' (default), or 'required'
'''
@api_misc_bp.route('valid_inputs/', methods = ['GET'])
def valid_inputs():
    
    if 'type' not in request.args:
        return jsonify(cp.columns_detailed)  
      
    type = request.args['type']
    if type == 'all' :
        return jsonify(cp.columns_detailed)    
    elif type == 'required' :
        return jsonify(cp.required_columns_detailed)
    elif type == 'raw' :
        return jsonify(cp.columns_detailed_raw)
    return jsonify(f'error: invalid type {type}')

@api_misc_bp.route('generateSchedule/', methods=['POST'])
@require_post_params('term', 'year','days')
#@login_required
def generateSchedule():
    
    try:
        logging.debug('Fetching data...')
        data = request.get_json()                
        term = data.get('term')
        logging.debug(f'Fetched term. term = {term}')
        year = data.get('year')
        logging.debug(f'Fetched year. year = {year}')
        days = data.get('days')
        logging.debug(f'Fetched days. days = {days}')

        if term not in ['Fall', 'Spring'] :
            return jsonify({"error": "term must be Fall or Spring"}), 400

        logging.info('Creating Schedule')
        schedule = create_schedule(term, year, days, url = 'https://www.easternct.edu/academics/academic-calendar/index.html')

        return jsonify({'schedule': schedule.to_dict(orient = 'records')})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


''' Preview syllabus '''
@api_misc_bp.route('preview/', methods=['POST'])
@login_required
def preview():

    logging.info('Attempting syllabus download')

    # Get params for the request and get course ID
    try:
        data = request.get_json()
        logging.debug('Fetching data...')
        course_id = data.get('course_id')
        logging.debug(f'Fetched course_id. course_id = {course_id}')
        # #test previewing from homepage
        # course_id = request.args['id']
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    # try local file, otherwise try full path for PythonAnywhere
    try :
        path = "backend/docx/SyllabusTemplate.docx"
        logging.debug(f'Opening template file at: {path}')
        doc = Document(path)
    except :

        try :
            path = "/home/gdancik/CoursePlanningTool/backend/docx/SyllabusTemplate.docx"
            logging.debug(f'Opening template file at {path}')
            doc = Document(path)
        except :
            return jsonify({"error": "could not open Syllabus Template"}), 500

    
    #return jsonify({"result": "created doc"}), 200
    logging.debug(f'current_user.id: {current_user.id }')
    sheet_name = current_user.id 
    title = generate_syllabus(doc,course_id,sheet_name) #Can add url as parameter if syllabus webapage url changes

    # Save to a BytesIO stream
    logging.debug(f'Saving to BytesIO stream')
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)

    current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M")
    title += "_" + current_datetime
    
    logging.debug(f'Prompting to download')
    return send_file(
        file_stream,
        as_attachment=True,
        download_name=f"{title}.docx",
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
