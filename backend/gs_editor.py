"""
This module provides functions to create and manage Google Sheets using the Google Sheets and Google Drive APIs.
It includes functions to create a new sheet, add headers, get and update values in the sheet, and delete the sheet.
It requires a service account with access to the Google Sheets API and Google Drive API, which can be set up in the 
Google Cloud Console. The module will use the json file from the service account to authenticate and access the 
Google Sheets API by storing the json file in an environment variable named `GS_CREDENTIALS_JSON`.
"""
import gspread
import os
import json
from typing import Dict, Any
import pandas as pd
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
    json_str = os.getenv('GS_CREDENTIALS_JSON')
    
    #Set credentials from the JSON string
    credentials_dict: Dict[str, Any] = json.loads(json_str)

    # Create a gspread client using the credentials dictionary
    client = gspread.service_account_from_dict(credentials_dict)

    return client

def create_sheet(title: str = "CPT_Data", email: str = None) -> str:
    '''
    Creates a new Google Sheet with the specified title and returns its ID. Also can take an email to share the sheet with.
    Args:
        title (str): The title of the new Google Sheet.
        email (str, optional): The email address to share the sheet with. Defaults to None.
    Returns:
        str: The ID of the created Google Sheet.
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Create a new spreadsheet
    spreadsheet = client.create(title)
    spreadsheet_id = spreadsheet.id
    # Print the ID of the created spreadsheet
    print(f'Created Spreadsheet with Name: {spreadsheet.title} and ID: {spreadsheet_id}')

    if email:
        # Share the spreadsheet with a specific email
        spreadsheet.share('sencererabel@gmail.com', perm_type='user', role='writer')
        print(f'Spreadsheet shared with sencererabel@gmail.com')

    # Add course id columns to the spreadsheet
    add_headers(spreadsheet_id)
    
    # Return the ID of the created spreadsheet
    return spreadsheet_id

def add_headers(spreadsheet_id):
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

    print(f'Headeres added to the spreadsheet with ID: {spreadsheet_id}')

def getValue(course_id: str,columns: str, sheet_name: str = "CPT_Data") -> str:
    '''
    Gets the value of a specified column for a specified id. 
    Args:
        course_id (str): The ID of the course to retrieve values for.
        columns (str or list): The column name(s) to retrieve values from. Can be a single column name or a list of column names.
        sheet_name (str): The name of the Google Sheet to read from. Defaults to "CPT_Data".
    Returns:
        str: The value of the specified column for the specified course ID.
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open(sheet_name)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0)
    #Get the entire sheet
    data = sheet.get_all_records()

    #Make a pandas data from sheet
    df = pd.DataFrame(data)

    #Find row with the course id
    row = df[df['course_id'] == course_id]

    # Check if a row was found
    if row.empty:
        print(f"Course ID '{course_id}' not found.")
        return None
    
    #Check if columns is a list or a string
    #if column is list, we will return a list of cells
    if isinstance(columns, list):
        cells_dict = {}
        for column in columns:
            if column in row.columns:
                cells_dict[column] = row[column].values[0]
            else:
                print(f"Warning: Column '{column}' not found in the sheet.")
                cells_dict[column] = None
        return cells_dict
    #else we will return a single cell
    else:
        cell = row[columns].values[0]
        return cell

def updateValue(course_id: str,column: str, new_val,sheet_name: str = "CPT_Data"):
    '''
    Replaces the value of a specified column for a specified id.(Right now it just updates the value of a specified cell)
    Args:
        course_id (str): The ID of the course to update.
        column (str): The column name to update.
        new_val: The new value to set in the specified column.
        sheet_name (str): The name of the Google Sheet to update. Defaults to "CPT_Data". 
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open(sheet_name)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0)

    #Get the entire sheet
    data = sheet.get_all_records()

    #Make a pandas data from sheet
    df = pd.DataFrame(data)

    #find the row with the course id
    row = df[df['course_id'] == course_id].index[0] +2 #+2 because gspread is indexed at 1 and we have headers in the first row
    col_idx = df.columns.get_loc(column)+1 #because gspread is indexed at 1

    #update cell
    sheet.update_cell(row, col_idx, new_val)

#Used for testing purposes
def read_sheet(sheet_name: str = "CPT_Data"):
    '''
    Reads and prints the contents of the specified Google Sheet.
    Args:
        sheet_name (str): The name of the Google Sheet to read from. Defaults to "CPT_Data".
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open(sheet_name)
    sheet = spreadsheet.get_worksheet(0)

    # Get all records
    records = sheet.get_all_records()

    # Convert to DataFrame for nice formatting
    df = pd.DataFrame(records)
    print(df.to_string(index=False))

def delete_sheet(sheet_name: str = "CPT_Data"):
    '''
    Deletes the specified Google Sheet by its name.
    Args:
        sheet_name (str): The name of the Google Sheet to delete. Defaults to "CPT_Data".
    '''
   # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by ID
    spreadsheet = client.open(sheet_name)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0)

    #save spreadsheet id
    spreadsheet_id = spreadsheet.id
    from googleapiclient.discovery import build
    # Define the scope
    SCOPE = ['https://www.googleapis.com/auth/drive']

    # Authenticate and create the service
    credentials = ServiceAccountCredentials.from_json_keyfile_name('key.json', SCOPE)
    drive_service = build('drive', 'v3', credentials=credentials)

    # Delete the specified spreadsheet
    drive_service.files().delete(fileId=spreadsheet_id).execute()
    
    print(f'Spreadsheet with Name: {sheet_name} and ID: {spreadsheet_id} deleted successfully.')
