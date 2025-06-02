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
import pandas as pd

from typing import Dict, Any
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

import course_planning as cp

def create_gs_client():
    '''
    Creates a Google Sheets client using a service account.
    '''
     # Define the scope
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']

   # Get the JSON string from the environment variable
    json_str = os.getenv('GS_CREDENTIALS_JSON')
    
    #Set credentials from the JSON string
    credentials_dict: Dict[str, Any] = json.loads(json_str)

    # Create a gspread client using the credentials dictionary
    client = gspread.service_account_from_dict(credentials_dict)

    return client

def create_sheet(sheet_name: str = "CPT_Data", email: str = None) -> str:
    '''
    Creates a new Google Sheet with the specified name and returns its ID. Also can take an email to share the sheet with.
    Args:
        sheet_name (str): The name of the new Google Sheet.
        email (str, optional): The email address to share the sheet with. Defaults to None.
    Returns:
        str: The ID of the created Google Sheet.
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Create a new spreadsheet
    spreadsheet = client.create(sheet_name)
    spreadsheet_id = spreadsheet.id

    # Print the name and ID of the created spreadsheet
    print(f'Created Spreadsheet with name: {spreadsheet.title} and ID: {spreadsheet_id}')

    if email:
        # Share the spreadsheet with a specific email
        spreadsheet.share(email, perm_type='user', role='writer')
        print(f'Spreadsheet shared with {email}')

    # Add course id columns to the spreadsheet
    add_headers(spreadsheet_id)
    
    # Return the ID of the created spreadsheet
    return spreadsheet_id

def add_headers(spreadsheet_id):
    '''
    Adds the column headers for the sheet using course_planning.py columns.
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

    print(f'Headers added to the spreadsheet with ID: {spreadsheet_id}')

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

    # Open the spreadsheet by name
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

def updateValue(course_id: str, values_dict: Dict[str, Any], sheet_name: str = "CPT_Data"):
    '''
    Adds or updates multiple values for a specified course ID.
    If the course ID does not exist, it will create a new row.

    Args:
        course_id (str): The ID of the course to add/update the values for.
        values_dict (Dict[str, Any]): A dictionary where keys are column names and values are the new values to set.
        sheet_name (str): The name of the Google Sheet to update. Defaults to "CPT_Data".
    '''
    # Create a Google Sheets client
    client = create_gs_client()
    # Open the spreadsheet by name
    spreadsheet = client.open(sheet_name)

    # Select the first sheet
    sheet = spreadsheet.get_worksheet(0) 

    # Get all records to check for existing course_id and column headers
    data = sheet.get_all_records()
    df = pd.DataFrame(data)

    # Get the current column headers from the sheet
    sheet_headers = sheet.row_values(1) 

    # Find the row index for the course_id if it exists
    course_row_index = None
    if not df.empty and course_id in df['course_id'].values:
        course_row_index = df[df['course_id'] == course_id].index[0] + 2 # +1 for 1-based, +1 for header row

    if course_row_index:
        print(f"Course ID '{course_id}' found. Updating existing row...")
        # Update existing record
        for column, new_val in values_dict.items():
            if column in sheet_headers:
                col_index = sheet_headers.index(column) + 1 # Convert to 1-based index
                sheet.update_cell(course_row_index, col_index, new_val)
            else:
                print(f"Warning: Column '{column}' not found in sheet '{sheet_name}'. Skipping update for this column.")
    else:
        print(f"Course ID '{course_id}' not found. Appending new row...")
        # If course_id does not exist, prepare a new row
        # Initialize new row with None for all *known* sheet headers
        
        new_row_values = {}  
        for col in sheet_headers:
            new_row_values[col] = None

        # Set the course_id in the new row
        new_row_values['course_id'] = course_id

        # Add the provided values from values_dict
        for column, new_val in values_dict.items():
            if column in sheet_headers:
                new_row_values[column] = new_val
            else:
                print(f"Warning: Column '{column}' not found in sheet '{sheet_name}'.")

        # Ensure values are in the correct order for appending
        ordered_new_row = []  # Initialize an empty list to store the ordered values
        for header in sheet_headers:
            # Append the value from new_row_values or None if not present
            # This ensures that the new row matches the order of the headers
            value = new_row_values.get(header, None)
            ordered_new_row.append(value)
        # Append the new row to the sheet
        sheet.append_row(ordered_new_row)

    print(f"Successfully processed values for course ID '{course_id}'.")

#Used for testing purposes
def read_sheet(sheet_name: str = "CPT_Data"):
    '''
    Reads and prints the contents of the specified Google Sheet.
    Args:
        sheet_name (str): The name of the Google Sheet to read from. Defaults to "CPT_Data".
    '''
    # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by name
    spreadsheet = client.open(sheet_name)
    sheet = spreadsheet.get_worksheet(0)

    # Get all records
    records = sheet.get_all_records()

    # Convert to DataFrame for nice formatting
    df = pd.DataFrame(records)
    return df

def delete_sheet(sheet_name: str = "CPT_Data"):
    '''
    Deletes the specified Google Sheet by its name.
    Args:
        sheet_name (str): The name of the Google Sheet to delete. Defaults to "CPT_Data".
    '''
   # Create a Google Sheets client
    client = create_gs_client()

    # Open the spreadsheet by name
    spreadsheet = client.open(sheet_name)

    #save spreadsheet id
    spreadsheet_id = spreadsheet.id
    
    #Call the Google Drive API to delete the spreadsheet
    # Define the scope
    SCOPE = ['https://www.googleapis.com/auth/drive']


    json_str = os.getenv('GS_CREDENTIALS_JSON')
    
    #Set credentials from the JSON string
    credentials_dict: Dict[str, Any] = json.loads(json_str)
    # Authenticate and create the service
    credentials = ServiceAccountCredentials.from_json_keyfile_dict(credentials_dict, scopes=SCOPE)
    drive_service = build('drive', 'v3', credentials=credentials)

    # Delete the specified spreadsheet
    drive_service.files().delete(fileId=spreadsheet_id).execute()
    # Print confirmation message
    print(f'Spreadsheet with Name: {sheet_name} and ID: {spreadsheet_id} deleted successfully.')
