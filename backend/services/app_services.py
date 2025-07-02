from backend.services.gs_editor import gsEditor
from flask_login import current_user
import logging

def get_gs_editor() :
    #return gsEditor('annie')
    #return gsEditor(session['user'])

    if not current_user or not current_user.is_authenticated:
        raise Exception("User is not authenticated")

    username = current_user.id
    gs = gsEditor(sheet_name=username)

    try:
        if not gs.sheet_exists():

            gs.create_sheet(email="christowindow@gmail.com")  #
            logging.info(f"Created and shared new sheet for {username}")
        else:
            logging.info(f"Sheet for {username} already exists")
    except Exception as e:
        logging.error(f"Error creating or sharing sheet for {username}: {e}")
        raise

    return gs

