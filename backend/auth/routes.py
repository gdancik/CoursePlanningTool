from flask import request, session, jsonify
from flask_login import UserMixin, login_user, login_required, logout_user, current_user

#from backend.services.gs_editor import gsEditor
from backend.services.app_services import get_fs_editor

from . import auth_bp
import logging

''' Routes to handle login and logout'''

@auth_bp.route('logout/')
@login_required
def logout():
    logging.info('Logging out user')
    logout_user()
    logging.debug('clearing session')
    session.clear()
    return 'User is logged out, now you cannot access <a href = "/api/hello/">/api/hello/</a>' 



