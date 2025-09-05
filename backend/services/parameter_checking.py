from functools import wraps
from flask import request, jsonify
import backend.services.course_planning as cp

def require_post_params(*params):
    '''
    Decorator factory to check required post parameters. For 'list_of_columns' 
    or 'dict_of_columns_and_vals', check values are valid fields

    Returns an error for invalid or extra parameters

    Example usage:
    @require_params('course_id')
    '''

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.content_length > 0 and request.content_type != 'application/json' :
                return jsonify({"error": "Content type must be application/json"}), 400
            
            data = request.get_json(silent = True) or {}

            # check that parameters are valid
            for p in params :
                if p not in data:
                    return jsonify({"error": f"Missing required parameter: {p}"}), 400
            
            li = data.get('list_of_columns')
            if li:
                if not isinstance(li, list):
                     return jsonify({"error": f"list_of_columns must be a list"}), 400
                else :
                    for field in li :
                        if field not in cp.columns :
                            return jsonify({"error": f"list_of_columns has invalid field: {field}"}), 400

            d = data.get('dict_of_columns_and_vals')
            if d:
                if not isinstance(d, dict) :
                    return jsonify({"error": f"dict_of_columns_and_vals must be a dictionary"}), 400
                else :
                    for field in d.keys():
                        if field not in cp.columns :
                            return jsonify({"error": f"dict_of_columns_and_vals has invalid field: {field}"}), 400

            # check for extra parameters
            if len(data) == len(params) :
                return f(*args, **kwargs)
            extra = set(data) - set(params)
            return jsonify({"error": f"invalid parameters: {extra}"}), 400
        
        return decorated_function
    return decorator