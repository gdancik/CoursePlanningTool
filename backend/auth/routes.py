from flask import request, redirect, session, jsonify, url_for
from flask_login import UserMixin, login_user, login_required, logout_user, current_user
from urllib.parse import urlparse, urlunparse


from backend.models.login import User
#from backend.services.gs_editor import gsEditor
from backend.services.app_services import get_fs_editor

import google_auth_oauthlib.flow
import logging, json, os, requests
from . import auth_bp

import logging


'''
Set up the Google Authorization flow
'''


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

    logging.info(f'Google authorization and setting state')

    oauth_config = json.loads(os.environ['GS_AUTH_JSON'])
    oauth_flow = google_auth_oauthlib.flow.Flow.from_client_config(
    oauth_config,
    # scopes define what APIs you want to access on behave of the user once authenticated
    scopes=[
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
    ])

    oauth_flow.redirect_uri = url_for('auth.oauth2callback', _external = True)
    authorization_url, state = oauth_flow.authorization_url()
    session['state'] = state # set the state so we can confirm on redirect
    logging.info(f'State is set')

    referrer = request.args.get('referrer')

    if referrer:
      session['referrer'] = referrer
    else :
      session['referrer'] = request.referrer

    logging.info(f'set referrer and redirect to authorization_url')

    return redirect(authorization_url)


# after authenticating with Google, you are redirected here
@auth_bp.route('oauth2callback')
def oauth2callback():

    logging.info(f'In oauth2callback')

    print("Saved state:", session.get('state'))
    print("Returned state:", request.args.get('state'))

    logging.info(f"state = {session.get('state', 'Not Found')}")

    if session['state'] != request.args['state']:
        logging.info(f'Invalid state -- try logging in again')
        return redirect(url_for('auth.google_login', _external = True))


    # create flow and set state
    oauth_config = json.loads(os.environ['GS_AUTH_JSON'])
    oauth_flow = google_auth_oauthlib.flow.Flow.from_client_config(
    oauth_config,
    # scopes define what APIs you want to access on behave of the user once authenticated
    scopes=[
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
    ], state = session['state'])

    oauth_flow.redirect_uri = url_for('auth.oauth2callback', _external = True)

    logging.info(f'call fetch token')
    logging.info(f' url: {request.url}')
    logging.info(f'url2: {request.url.replace("http:", "https:")}')

    oauth_flow.fetch_token(authorization_response=request.url.replace('http:', 'https:'))

    logging.info(f'set token')
    session['access_token'] = oauth_flow.credentials.token
    logging.info(f'Access token is set, printing session:')
    logging.info(session)

    #if session['referrer'] :
    #  logging.info(f'redirecting to {session["referrer"]}')
    #  return redirect(session['referrer'])

    logging.info(f'Redirecting to profile...')

    if session['referrer'] :
      profile()
      logging.info(f'redirecting to {session["referrer"]}')
      return redirect(session['referrer'])

    return redirect(url_for('auth.profile', _external = True))



@auth_bp.route('clear/')
def clear() :
    session.clear()
    return "Cleared"

@auth_bp.route('profile/')
def profile() :
    logging.info(f'In profile, printing session')
    logging.info(session)

    session['testing'] = "Session is Saved"
    #return redirect("https://127.0.0.1:3000/test-page")

    #return jsonify({"response": "hi"}), 200

    if not 'access_token' in session :
        logging.info(f'profile -- access_token not in session')
        return jsonify({"error": "User not authenticated"}), 401

    if not session['access_token']:
        logging.info(f'not session access token -- redirecting to login')
        return redirect(url_for('auth.google_login', _external = True))

    # get user info
    response = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={
       "Authorization": f"Bearer {session['access_token']}"
    })

    logging.info(f'got response')
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
def logout():
    logging.info('Logging out user')
    logout_user()
    logging.debug('clearing session')
    session.clear()
    return 'User is logged out, now you cannot access <a href = "/api/hello/">/api/hello/</a>'


'''
Test endpoints for whether we can save session, to  mimic Google login -- this works in Chrome but not Firefox
'''
@auth_bp.route('p1/')
def p1() :
    session['testing'] = "Session is Saved"
    return redirect("https://127.0.0.1:3000/test-page")

@auth_bp.route('p2/')
def p2() :
    return session.get("testing", "Not Found"), 200

