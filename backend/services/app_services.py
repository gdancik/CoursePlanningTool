from backend.services.gs_editor import gsEditor
from flask_login import current_user

def get_gs_editor() :
    #return gsEditor('annie')
    #return gsEditor(session['user'])
    return gsEditor(current_user.id)