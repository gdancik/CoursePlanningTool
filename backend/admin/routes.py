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

<!-- Time filter controls -->
<input type="number" id="daysInput" placeholder="Enter days" value="7">
<button id="filterButton">Filter</button>

<!-- User dropdown -->
<select id="userFilter">
    <option value="">-- All Users --</option>
    {user_dropdown_options}
</select>

<!-- Tables (must be in this order) -->
<div class='firestore_table'>
    <h3>Firestore stats (summary)</h3>
    {sheet_all_html}
</div>

<div class='firestore_table'>
    <h3>Firestore stats (by user)</h3>
    {sheet_by_user_html}
</div>
<script>
async function filterTable() {{
    const days = parseInt(document.getElementById("daysInput").value);
    const userFilter = document.getElementById('userFilter').value;

    if (isNaN(days)) {{
        alert("Please enter a valid number of days.");
        return;
    }}

    try {{
        const response = await fetch('/admin/filter_by_days', {{
            method: 'POST',
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify({{ days: days }})
        }});

        const data = await response.json();

        // Update both tables
        document.querySelectorAll('.firestore_table')[0].innerHTML = `
            <h3>Firestore stats (summary, last ${{days}} days)</h3>
            ${{data.sheet_all_html}}
        `;

        document.querySelectorAll('.firestore_table')[1].innerHTML = `
            <h3>Firestore stats (by user, last ${{days}} days)</h3>
            ${{data.sheet_by_user_html}}
        `;

        // Update user dropdown
        const dropdown = document.getElementById('userFilter');
        dropdown.innerHTML = '<option value="">-- All Users --</option>' +
            data.user_ids.map(id => `<option value="${{id}}">${{id}}</option>`).join('');

        // Apply user filter if one was selected
        if (userFilter) {{
            filterUserTable(userFilter);
        }}

    }} catch (error) {{
        console.error("Error:", error);
        alert("Failed to filter data.");
    }}
}}

function filterUserTable(userId) {{
    const container = document.querySelectorAll('.firestore_table')[1];
    const table = container.querySelector('table');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {{
        if (index === 0) return; // Skip header
        const cells = row.querySelectorAll('td');
        if (userId === '' || cells[0].textContent.trim() === userId) {{
            row.style.display = '';
        }} else {{
            row.style.display = 'none';
        }}
    }});
}}

// Event listeners
document.getElementById("filterButton").addEventListener("click", filterTable);
document.getElementById("userFilter").addEventListener("change", function() {{
    filterUserTable(this.value);
}});
</script>
'''
    return header + user + page

from flask import jsonify, request
@admin_bp.route('/filter_by_days', methods=['POST'])
def filter_by_days():
    data = request.get_json()
    days = int(data.get('days', 7))  # Default to 7 days

    # Get filtered data for both tables
    sheet_all = fs_stats.summarize_specifed_days_old(days, byUser=False)
    sheet_by_user = fs_stats.summarize_specifed_days_old(days, byUser=True)

    return jsonify({
        'sheet_all_html': sheet_all.to_html(classes="data", index=False, border=1),
        'sheet_by_user_html': sheet_by_user.to_html(classes="data", index=False, border=1),
        'user_ids': sheet_by_user['user_id'].unique().tolist() if 'user_id' in sheet_by_user.columns else []
    })