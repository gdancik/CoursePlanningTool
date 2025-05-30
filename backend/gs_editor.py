"""
This module provides functions to create and manage Google Sheets using the Google Sheets and Google Drive APIs.
It includes functions to create a new sheet, add a column, get values from a column, and update
values in a column. In order to use this module, you need to have a Google Cloud project with 
the Google Sheets API enabled and a service account with the appropriate permissions.
The module will use the json file from the service account to authenticate and accessthe Google Sheets API 
by dropping the json file in the same directory as this script. In order to edit the sheets you
also have to share your file with the service account using its gmail.
"""
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import course_planning as cp

def create_gs_client():
    '''
    Creates a Google Sheets client using a service account.
    '''
     # Define the scope
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']

    # Add your service account file
    credentials = ServiceAccountCredentials.from_json_keyfile_name('key.json', scope)

    # Authorize the client
    client = gspread.authorize(credentials)

    return client

#TODO Add optionial email to share the sheet with
def create_sheet(title: str, email: str = None) -> str:
    '''
    Creates a new Google Sheet with the specified title and returns its ID.(Right now it automatically shares the sheet with a specific email)
    Args:
        title (str): The title of the new Google Sheet.
    Returns:
        str: The ID of the created Google Sheet.
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Create a new spreadsheet
    spreadsheet = client.create(title)

    # Print the ID of the created spreadsheet
    print(f'Created Spreadsheet with ID: {spreadsheet.id}')

    if email:
        # Share the spreadsheet with a specific email
        spreadsheet.share('sencererabel@gmail.com', perm_type='user', role='writer')
        print(f'Spreadsheet shared with sencererabel@gmail.com')

    # Add course id columns to the spreadsheet
    add_course_id(spreadsheet_id)
    
    # Return the ID of the created spreadsheet
    return spreadsheet.id


def add_course_id(spreadsheet_id):
    '''
    Adds a the titles for the course id columns to the specified Google Sheet.
    Args:
        spreadsheet_id (str): The ID of the Google Sheet to update.
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open_by_key(spreadsheet_id)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0)

    # Define the values you want to write to the first row
    values = cp.columns

    # Update the first row with the new values
    sheet.update([values], 'A1')

    print(f'Course ID columns added to the spreadsheet with ID: {spreadsheet_id}')

def getValue(spreadsheet_id: str,cell: str) -> str:
    '''
    Gets the value of a specified column for a specified id. (For now it just gets the value of a specified cell)
    Args:
        spreadsheet_id (str): The ID of the Google Sheet.
        cell (str): The cell to get the value from (e.g., 'A1').
    Returns:
        str: The value of the specified cell.
    '''
       # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open_by_key(spreadsheet_id)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0)

    # Get the value of the specified cell
    cell_value = sheet.acell(cell).value

    return cell_value
    
def updateValue(spreadsheet_id: str,cell: str, new_val: str):
    '''
    Replaces the value of a specified column for a specified id.(Right now it just updates the value of a specified cell)
    Args:
        spreadsheet_id (str): The ID of the Google Sheet.
        cell (str): The cell to update (e.g., 'A1').
        new_val (str): The new value to set in the specified cell.
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open_by_key(spreadsheet_id)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0)

    # Update the specified cell with the new value
    sheet.update_acell(new_val, cell)

def read_sheet(spreadsheet_id: str):
   # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open_by_key(spreadsheet_id)
    sheet = spreadsheet.get_worksheet(0)
   # Get all records
    records = sheet.get_all_records()
    print(records)

def delete_sheet(spreadsheet_id: str):
    '''
    Deletes the specified Google Sheet by its ID.
    Args:
        spreadsheet_id (str): The ID of the Google Sheet to delete.
    '''
   # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open_by_key(spreadsheet_id)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0)

    # Delete the spreadsheet
    sheet.delete()
    print(f'Spreadsheet with ID {spreadsheet_id} deleted successfully.')

if __name__ == "__main__":
    # Example usage

    spreadsheet_id = '1n43mkRVtDJy5SyfATutBVXD85i481G3WzhXm440K0lY'
    # read_sheet(spreadsheet_id)
    add_course_id(spreadsheet_id)
    # updateValue(spreadsheet_id, "241", 'C2')
    # updateValue(spreadsheet_id, "CSC", 'B2')
    # updateValue(spreadsheet_id, "Dr. Sencer Erabel", 'A2')
    # print(getValue(spreadsheet_id,'C2'))
   
    # sheet_id = create_sheet("Test Sheet2")
    # delete_sheet(spreadsheet_id) 
   