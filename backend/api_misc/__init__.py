from flask import Blueprint

api_misc_bp = Blueprint('api_misc', __name__)

from . import routes
