from backend.services.firestore_editor import fsEditor
from flask_login import current_user

def get_fs_editor() :
    #return gsEditor('annie')
    #return gsEditor(session['user'])
    return fsEditor(current_user.id)