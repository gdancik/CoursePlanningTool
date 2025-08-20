from flask import request, redirect, session, jsonify, url_for
from flask_login import UserMixin, login_user, login_required, logout_user, current_user

from backend.services.app_services import get_gs_editor
from backend.models.login import User

import google_auth_oauthlib.flow
import logging, json, os, requests
from . import auth_bp


'''
Set up the Google Authorization flow
'''
oauth_config = json.loads(os.environ['GS_AUTH_JSON'])
oauth_flow = google_auth_oauthlib.flow.Flow.from_client_config(
    oauth_config,
    # scopes define what APIs you want to access on behave of the user once authenticated
    scopes=[
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
    ]
)

''' Routes to handle login and logout'''


@auth_bp.route('google_login/')
def google_login() :
    oauth_flow.redirect_uri = url_for('auth.oauth2callback', _external = True)
    authorization_url, state = oauth_flow.authorization_url()
    session['state'] = state # set the state so we can confirm on redirect

    return redirect(authorization_url)
    
# after authenticating with Google, you are redirected here
@auth_bp.route('/oauth2callback')
def oauth2callback():
    if not session['state'] == request.args['state']:
        return 'Invalid state parameter', 400
    oauth_flow.fetch_token(authorization_response=request.url.replace('http:', 'https:'))    
    session['access_token'] = oauth_flow.credentials.token

    # get user info
    response = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={
       "Authorization": f"Bearer {session['access_token']}"
    })

    if response.status_code == 200:
        user_info = response.json()
        email = user_info['email']
        name = user_info['name']
        user = User(email)       
        login_user(user)
        return jsonify(id = email, name = name)        
    else:
        return(f"Failed to fetch user info: {response.status_code} {response.text}")        


@auth_bp.route('logout/')
@login_required
def logout():
    logging.info('Logging out user')
    logout_user()
    logging.debug('clearing session')
    session.clear()
    return 'User is logged out, now you cannot access <a href = "/api/hello/">/api/hello/</a>' 
