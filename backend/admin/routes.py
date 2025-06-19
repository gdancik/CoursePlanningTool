from . import  admin_bp
from backend.services.app_services import get_gs_editor
from flask_login import current_user

'''Admin page'''
@admin_bp.route('/')
def admin():

    if not current_user.is_authenticated :
      return '<h2>Under construction</h2>'

    gs = get_gs_editor()
    gs.create_sheet()
    url = f'https://docs.google.com/spreadsheets/d/{gs.id}'
    
    page = f'''
    <h2> Admin Page </h2>
    <ul>
    <li>Sheet name: {gs.sheet_name} </li>
    <li>Sheet id: {gs.id} </li>
    <li>url: <a href = "{url}">{url}</a></li>
    <li>API count: {gs.api_count}
    </ul>
    '''
    
    return page
