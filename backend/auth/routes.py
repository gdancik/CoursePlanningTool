from flask import request, redirect, session, jsonify, url_for
from flask_login import UserMixin, login_user, login_required, logout_user, current_user

from backend.models.login import User
#from backend.services.gs_editor import gsEditor
from backend.services.app_services import get_fs_editor

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

'''
Handle get request to google_login with optional referrer parameter
This endpoint creates an authorization flow which redirects the user to a google login, and if
successful calls auth.oauth2callback which redirects to the referrer. If the referrer is not
specified, its value is taken from request.referral (which likely includes the domain but not full path).
If this is None (for example, because we are accessing it directly from the flask server, then user info
is returned in json format.
'''
@auth_bp.route('google_login/')
def google_login() :
    oauth_flow.redirect_uri = url_for('auth.oauth2callback', _external = True)
    authorization_url, state = oauth_flow.authorization_url()
    session['state'] = state # set the state so we can confirm on redirect

    referrer = request.args.get('referrer')   
 
    if referrer:
      session['referrer'] = referrer  
    else :
      session['referrer'] = request.referrer

    return redirect(authorization_url)


# after authenticating with Google, you are redirected here
@auth_bp.route('oauth2callback')
def oauth2callback():
    if not session['state'] == request.args['state']:
        return redirect(url_for('auth.google_login', _external = True))

    oauth_flow.fetch_token(authorization_response=request.url.replace('http:', 'https:'))    
    session['access_token'] = oauth_flow.credentials.token

    if session['referrer'] :
      return redirect(session['referrer'])

    return redirect(url_for('auth.profile', _external = True))

@login_required
@auth_bp.route('profile/') 
def profile() :

    if not 'access_token' in session :
       return 'No access token -- did you try /api/google_login?'
    
    if not session['access_token']:
        return redirect(url_for('auth.google_login', _external = True))
    
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
        return jsonify(user = email, name = name)        
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
