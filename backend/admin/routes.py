from . import  admin_bp
from backend.services import firestore_stats as fs_stats
from backend.services.app_services import get_fs_editor
from backend.services.firestore_editor import fsEditor
from flask_login import current_user

'''Admin page'''
@admin_bp.route('/')
def admin():

    
    if not current_user.is_authenticated :
        fs = fsEditor('NO USER')
    else :
        fs = get_fs_editor()  
    
    #sheet = fs.read_collection()
    
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

    user_ids = sheet_by_user['user_id'].unique() if 'user_id' in sheet_by_user.columns else []

    # Generate dropdown options
    user_dropdown_options = ''.join(
        f'<option value="{user_id}">{user_id}</option>' for user_id in user_ids
    )
    
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

     <!-- Dropdown to filter users -->
    <select id="userFilter">
        <option value="">-- All Users --</option>
        {user_dropdown_options}
    </select>
    <input type="number" id="daysInput" placeholder="Enter days">
    <button id="filterButton" onclick="filterTable()">Filter</button>
    <div class = 'firestore_table'>
    <h3> Firestore stats (summary)</h3>
    
    {sheet_all_html}
    </div>
    </br>
    <div id="userTableContainer" class = 'firestore_table'>
    <h3> Firestore stats (by user)</h3>
    {sheet_by_user_html}
    </div>

     <script>
        function filterTable() {{
            const filter = document.getElementById('userFilter').value;
            const container = document.getElementById('userTableContainer');
            const table = container.querySelector('table');
            const rows = table.querySelectorAll('tr');

            rows.forEach((row, index) => {{
                // Skip header row (index 0)
                if (index === 0) return;

                const cells = row.querySelectorAll('td');
                // Assuming user_id is in the first column (index 0)
                if (filter === '' || cells[0].textContent === filter) {{
                    row.style.display = '';
                }} else {{
                    row.style.display = 'none';
                }}
            }});
        }}

        document.getElementById("filterButton").addEventListener("click", function() {{
        // 1. Get the value from the input box
        const days = parseInt(document.getElementById("daysInput").value);

        // 2. Call the function with the input value
        if (!isNaN(days)) {{  // Validate input
            const result = fs_stats.summarize_specifed_days_old(days);

            sheet_all = fs_stats.summarize_specifed_days_old(days);
            sheet_by_user = fs_stats.summarize_specifed_days_old(days, byUser = True);
    }});
    </script>
    '''
    return header + user + page
