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

class gsEditor:
    '''
    A class to manage Google Sheets for course planning data.
    It allows creating a new sheet, adding headers, getting and updating values, and deleting the sheet.
    It uses a service account to authenticate and access the Google Sheets API.
    Attributes:
        sheet_name (str): The name of the Google Sheet to be created or managed.
        client (gspread.Client): The Google Sheets client used to interact with the API.
    '''

    def __init__(self, sheet_name: str="CPT_Data"):
        self.sheet_name = sheet_name
        self.client = self.create_gs_client()

    @staticmethod
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
    
    def set_sheet_name(self, sheet_name: str="CPT_Data"):
        '''
        Sets the name of the Google Sheet to be created or managed.
        Args:
            sheet_name (str): The name of the Google Sheet.
        Returns:
            None
        '''
        self.sheet_name = sheet_name

    def create_sheet(self, email: str = None) -> str:
        '''
        Creates a new Google Sheet with the specified name and optionally shares it with a given email.
        Args:
            email (str): The email address to share the sheet with. If None, the sheet will not be shared.
        Returns:
            str: The ID of the created Google Sheet.
        '''
        # Create a Google Sheets client
        client = self.client

        # Create a new spreadsheet
        spreadsheet = client.create(self.sheet_name)
        spreadsheet_id = spreadsheet.id

        # Print the name and ID of the created spreadsheet
        print(f'Created Spreadsheet with name: {spreadsheet.title} and ID: {spreadsheet_id}')

        if email:
            # Share the spreadsheet with a specific email
            spreadsheet.share(email, perm_type='user', role='writer')
            print(f'Spreadsheet shared with {email}')

        # Add course id columns to the spreadsheet
        self.add_headers(spreadsheet_id)
        
        # Return the ID of the created spreadsheet
        return spreadsheet_id

    def add_headers(self, spreadsheet_id):
        '''
        Adds headers to the first row of the specified Google Sheet.
        Args:
            spreadsheet_id (str): The ID of the Google Sheet to add headers to.
        Returns:
            None
        '''
        # Create a Google Sheets client
        client = self.client

        # Open the spreadsheet by ID
        spreadsheet = client.open_by_key(spreadsheet_id)

        # Select the first sheet
        sheet = spreadsheet.get_worksheet(0)

        # Define the values you want to write to the first row
        values = cp.columns

        # Update the first row with the new values
        sheet.update([values], 'A1')

        print(f'Headers added to the spreadsheet with ID: {spreadsheet_id}')

    def getValue(self, course_id: str,columns: str) -> str:
        '''
        Retrieves a value from the Google Sheet based on the course ID and specified column.
        Args:
            course_id (str): The course ID to search for in the sheet.
            columns (str or list): The column name(s) to retrieve values from. If a list, returns a dictionary of values.
        Returns:
            str or dict: The value from the specified column for the given course ID, or a dictionary of values if multiple columns are specified.
        '''
        # Create a Google Sheets client
        client = self.client

        # Open the spreadsheet by name
        spreadsheet = client.open(self.sheet_name)

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

    def updateValue(self, course_id: str, values_dict: Dict[str, Any]):
        '''
        Updates a value in the Google Sheet for a given course ID. If the course ID exists, it updates the existing row;
        if not, it appends a new row with the course ID and provided values.
        Args:
            course_id (str): The course ID to search for in the sheet.
            values_dict (Dict[str, Any]): A dictionary containing column names as keys and the new values to update.
        Returns:
            None
        '''
        # Create a Google Sheets client
        client = self.client
        # Open the spreadsheet by name
        spreadsheet = client.open(self.sheet_name)

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
    def read_sheet(self):
        '''
        Reads the entire Google Sheet and returns it as a pandas DataFrame.
        Returns:
            pd.DataFrame: A DataFrame containing all records from the Google Sheet.
        '''
        # Create a Google Sheets client
        client = self.create_gs_client()
        

        # Open the spreadsheet by name
        spreadsheet = client.open(self.sheet_name)
        sheet = spreadsheet.get_worksheet(0)

        # Get all records
        records = sheet.get_all_records()

        # Convert to DataFrame for nice formatting
        df = pd.DataFrame(records)
        return df

    def delete_sheet(self):
        '''
        Deletes the Google Sheet with the specified name.
        This function uses the Google Drive API to delete the sheet.
        Returns:
            None
        '''
    # Create a Google Sheets client
        client = self.create_gs_client()
        
        # Open the spreadsheet by name
        spreadsheet = client.open(self.sheet_name)

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
        print(f'Spreadsheet with Name: {self.sheet_name} and ID: {spreadsheet_id} deleted successfully.')
