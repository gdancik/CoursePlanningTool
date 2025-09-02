from . import  admin_bp
from backend.services import firestore_stats as fs_stats
from flask_login import current_user

'''Admin page'''
@admin_bp.route('/')
def admin():

    '''
    if not current_user.is_authenticated :
      return '<h2>Please login by clicking <a href = "/api/test_login/?user=annie&password=password">here</a></h2>'
    '''

    # Create database tables if they don't exist
    try:
        fs_stats.create_tables()
        sheet = fs_stats.summarize_tables()
    except Exception as e:
        return f'<h2>Database Error: {str(e)}</h2><p>Please check the database setup.</p>'
    
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

	  .firestore-table {{
              overflow-x: auto;
              max-width: 100%;
          }}
    </style>

    <h2> Admin Page </h2>
    <div class = 'firestore_table'>
    {table_html}
    </div>
    </br>
    '''
   
 
    return page
