from . import  admin_bp
from backend.services import firestore_stats as fs_stats
from flask_login import current_user

'''Admin page'''
@admin_bp.route('/')
def admin():
    
    header = '<h2> Admin Page </h2> <h3> Current user </h3>'

    user = '<div>Not logged in</div><hr>'

    if current_user.is_authenticated :
       user = f'''
       <div>
              <ul>
              <li> id: {current_user.id} </li>            
              <ul>
        </div>
        <hr>
              '''

    sheet_all = fs_stats.summarize_tables()
    sheet_by_user = fs_stats.summarize_tables(byUser = True)
    
    

    sheet_all_html = sheet_all.to_html(classes="data", index=False, border=1)
    sheet_by_user_html = sheet_by_user.to_html(classes="data", index=False, border=1)
    
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

    <div class = 'firestore_table'>
    <h3> Firestore stats (summary)</h3>
    {sheet_all_html}
    </div>
    </br>
    <div class = 'firestore_table'>
    <h3> Firestore stats (by user)</h3>
    {sheet_by_user_html}
    </div>
    '''

    return header + user + page