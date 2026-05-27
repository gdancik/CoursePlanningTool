from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from backend.models.login import login_manager
from backend.main import main_bp
from backend.api_firestore import api_firestore_bp
from backend.api_misc import api_misc_bp
from backend.auth import auth_bp
from backend.admin import admin_bp
from backend.config import Config
import logging

def create_app(config=Config):
    '''Create and configure Flask app with Swagger documentation'''

    # Create app
    app = Flask(__name__)
    app.secret_key = "my secret key"
    app.config.from_object(Config)

    # Configure CORS
    CORS(app,
         resources={r"/api/*": {
             "origins": [
                 "http://127.0.0.1:3000",
                 "http://localhost:3000",
                 "https://127.0.0.1:3000",
                 "https://courseplanningtool2.pages.dev",
                 "https://cfa936b2.courseplanningtool2.pages.dev"
             ]
         }},
         supports_credentials=True
    )

    # Session cookie settings
    app.config.update(
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=True  # use False temporarily for localhost testing
    )

    # Configure Swagger
    app.config['SWAGGER'] = {
        "title": "Course Planning Tool API",
        "uiversion": 3,
        "specs_route": "/api/docs/",
        "openapi": "3.0.2",
        "info": {
            "title": "Course Planning Tool API",
            "description": "API for Course Planning Tool (<a href = 'https://github.com/gdancik/CoursePlanningTool'>View code on Github</a>)",
            "version": "1.0.0"
        },
        "doc_dir": "./docs"  # Optional: directory to store generated docs
    }
    swagger = Swagger(app)

    # Initialize login manager
    login_manager.init_app(app)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_firestore_bp, url_prefix='/api')
    app.register_blueprint(api_misc_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    # Register test API in debug mode
    if app.config['DEBUG']:
        from backend.test_api import test_api_bp
        app.register_blueprint(test_api_bp, url_prefix='/api')

    # Configure logging
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
