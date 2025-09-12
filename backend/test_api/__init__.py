from flask import Blueprint

test_api_bp = Blueprint('test_api', __name__)

from . import routes
