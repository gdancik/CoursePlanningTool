from flask import request, redirect, make_response, session, jsonify, url_for
from flask_login import UserMixin, login_user, login_required, logout_user, current_user
from urllib.parse import urlparse, urlunparse

from backend.models.login import User
#from backend.services.gs_editor import gsEditor
from backend.services.app_services import get_fs_editor

import google_auth_oauthlib.flow

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

import logging, json, os, requests
from . import auth_bp

import logging




@auth_bp.route('clear/')
def clear() :
    session.clear()
    return "Cleared"


@auth_bp.route('logout/')
def logout():
    logging.info('Logging out user')
    logout_user()
    logging.debug('clearing session')
    session.clear()
    return 'User is logged out, now you cannot access <a href = "/api/hello/">/api/hello/</a>'

@auth_bp.route('/google_login', methods = ['POST'])
def google_login() :

    data = request.get_json()

    jwt = data.get('jwt')

    if not jwt :
        return jsonify(error = "must specify jwt"), 400

    oauth_config = json.loads(os.environ['GS_AUTH_JSON'])
    CLIENT_ID = oauth_config['web']['client_id']

    try:
        # Verify the integrity of the token
        idinfo = id_token.verify_oauth2_token(jwt, google_requests.Request(), CLIENT_ID)

        # At this point, token is valid and was issued to your app
        #user_id = idinfo["sub"]  # Google's unique user ID
        email = idinfo.get("email")
        name = idinfo.get("name")

        user = User(email)
        login_user(user)
        return jsonify(user = email, name = name)

    except Exception as e:
        # Invalid token
        return jsonify(error = str(e)), 401



