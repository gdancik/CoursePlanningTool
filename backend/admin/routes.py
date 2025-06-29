from . import  admin_bp
from backend.services.app_services import get_gs_editor
from flask_login import current_user

'''Admin page'''
@admin_bp.route('/')
def admin():

    if not current_user.is_authenticated :
      return '<h2>Please login by clicking <a href = "/api/test_login/?user=annie&password=password">here</a></h2>'

    gs = get_gs_editor()
    gs.create_sheet()

    sheet = gs.read_sheet()
    url = f'https://docs.google.com/spreadsheets/d/{gs.id}'
    
    table_html = sheet.to_html(classes="data", index=False, border=1)
    
    page = f'''
    <style>
          table.data {{
              border-collapse: collapse;
          }}
          table.data th, table.data td {{
              border: 1px solid black;
              padding: 8px;
          }}

	  .sheet-table {{
              overflow-x: auto;
              max-width: 100%;
          }}
    </style>

    <h2> Admin Page </h2>
    <ul>
    <li>Sheet name: {gs.sheet_name} </li>
    <li>Sheet id: {gs.id} </li>
    <li>url: <a href = "{url}">{url}</a></li>
    <li>API count: {gs.api_count}
    </ul>
    </hr>
    <div class = 'sheet_table'>
    {table_html}
    </div>
    </br>
    '''
   
 
    return page
