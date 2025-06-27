from flask import Flask
from flask_cors import CORS

from backend.models.login import login_manager 

from backend.main import main_bp
from backend.api import api_bp
from backend.auth import auth_bp
from backend.admin import admin_bp

from backend.config import Config



###############################################
# create app
###############################################
def create_app(config = Config):

    ''' Create app and login manager '''
    app = Flask(__name__)
    app.secret_key = "my secret key"
    app.config.from_object(Config)

    CORS(app, resources = {r"/api/*": 
    {"origins": [
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "need to add domain here"
    ]}},
    supports_credentials = True
    )


    login_manager.init_app(app)

    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    if app.config['DEBUG'] :
        from backend.test_api import test_api_bp
        app.register_blueprint(test_api_bp, url_prefix='/api')
    
  
    import logging
    if app.config['LOGGING'] == 'DEBUG':
        logging.basicConfig(level=logging.DEBUG,format="%(levelname)s from %(funcName)s: %(message)s")
    if app.config['LOGGING'] == 'INFO':
        logging.basicConfig(level=logging.INFO,format="%(levelname)s from %(funcName)s: %(message)s")
    elif app.config['LOGGING'] == 'WARN':
        logging.basicConfig(level=logging.WARN,format="%(levelname)s from %(funcName)s: %(message)s")
    elif app.config['LOGGING'] == 'ERROR':
        logging.basicConfig(level=logging.ERROR,format="%(levelname)s from %(funcName)s: %(message)s")
    elif app.config['LOGGING'] == 'CRITICAL':
        logging.basicConfig(level=logging.CRITICAL,format="%(levelname)s from %(funcName)s: %(message)s")
    elif app.config['LOGGING'] == 'NONE':
        logger = logging.getLogger()
        logging.disable(logging.CRITICAL)
    
        
    return app


