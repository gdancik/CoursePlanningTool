from flask import Blueprint

api_firestore_bp = Blueprint('api_firestore', __name__)

from . import routes
