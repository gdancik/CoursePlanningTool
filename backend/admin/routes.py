from . import  admin_bp
from backend.services.app_services import get_fs_editor
from flask_login import current_user

'''Admin page'''
@admin_bp.route('/')
def admin():

    if not current_user.is_authenticated :
      return '<h2>Please login by clicking <a href = "/api/test_login/?user=annie&password=password">here</a></h2>'

    fs = get_fs_editor()
    fs.set_collection_name()

    sheet = fs.read_sheet()
    url = f'https://docs.google.com/spreadsheets/d/{fs.id}'
    
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
    <li>Sheet name: {fs.sheet_name} </li>
    <li>Sheet id: {fs.id} </li>
    <li>url: <a href = "{url}">{url}</a></li>
    <li>API count: N/A</li>
    </ul>
    </hr>
    <div class = 'sheet_table'>
    {table_html}
    </div>
    </br>
    '''
   
 
    return page
