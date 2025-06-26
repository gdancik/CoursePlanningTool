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
import numpy as np
import time
import random

from datetime import datetime
from typing import Dict, Any
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
import backend.services.course_planning as cp
import logging

def exponential_backoff(request_func):
    '''
    Decorator to apply exponential backoff to request_func, for use with the gs_editor class
    '''
    def f(self, *args, **kwargs) :
        r = None
        wait = 1  # initial wait (in seconds)  
        for ntries in range(self.api_config['max_tries']) :        
            try :
                print(f'try #{ntries+1}')
                r = request_func(self, *args)
                print('request successful...returning')
                return r
            except Exception as err :
                print('Error:', err)
                if ntries == self.api_config['max_tries'] - 1 :
                   print('reached limit, raise error')
                   raise err
                if hasattr(err, 'code') and err.code == 429:
                    sleep_time = wait + random.random()
                    print(f'waiting for {sleep_time:.2f} seconds')                                       
                    time.sleep(sleep_time)
                    wait = wait * 2    
                    if wait > self.api_config['maximum_backoff'] :
                        wait = self.api_config['maximum_backoff']
        return Exception('Error in return from exponential_backoff') 
    return f

class gsEditor:
    '''
    A class to manage Google Sheets for course planning data.
    It allows creating a new sheet, adding headers, getting and updating values, and deleting the sheet.
    It uses a service account to authenticate and access the Google Sheets API.
    Attributes:
        sheet_name (str): The name of the Google Sheet to be created or managed.
        client (gspread.Client): The Google Sheets client used to interact with the API.
    '''

    def __init__(self, sheet_name: str):
        '''
        Initializes the gsEditor with a specified sheet name.
        Args:
            sheet_name (str): The name of the Google Sheet to be created or managed. Defaults to "CPT_Data".
        '''
        self.sheet_name = sheet_name
        self.id = None
        self.client = self.create_gs_client()
        self.api_count = 0
        
        self.api_config = {}
        self.set_api_config()

    def set_api_config(self, max_tries = 10, maximum_backoff = 32) :
        '''Setter for api_config max_tries and maximum_backoff'''
        self.api_config['max_tries'] = max_tries
        self.api_config['maximum_backoff'] = maximum_backoff

    @staticmethod
    def create_gs_client():
        '''
        Creates a Google Sheets client using a service account.
        '''
        logging.info('Creating GS client')
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
    
    def increase_api_count(self, message = None) :
        '''increases api_count by 1 and prints an optional message'''
        logging.info('Increasing API count')
        self.api_count += 1
        if message :
            print(message)

    def set_sheet_name(self, sheet_name: str="CPT_Data"):
        '''
        Sets the name of the Google Sheet to be created or managed.
        Args:
            sheet_name (str): The name of the Google Sheet.
        Returns:
            None
        '''
        logging.info('Setting sheet name')
        if sheet_name != self.sheet_name :
            self.sheet_name = sheet_name
            self.id = None

    @exponential_backoff
    def sheet_exists(self) :
        '''
        Returns True if the current 'sheet_name' exists
        '''
        logging.info('checking if sheet exist')
        self.increase_api_count('API call: list spreadsheet files')
        files = self.client.list_spreadsheet_files()
        for f in files :
            if f['name'] == self.sheet_name :
                return True
        return False

    @exponential_backoff
    def create_sheet(self, email: str = None) -> str:
        '''
        Creates a new Google Sheet with the specified name and optionally shares it with a given email.
        If the sheet exists, a new sheet will not be created.
        Args:
            email (str): The email address to share the sheet with. If None, the sheet will not be shared.
        Returns:
            str: The ID of the created Google Sheet.
        '''
       
        # Create a Google Sheets client
        client = self.client

        if not self.sheet_exists() :
            logging.info(f'Creating sheet')
            # Create a new spreadsheet
            self.increase_api_count('API call: create')
            spreadsheet = client.create(self.sheet_name)            
            
            # Print the name and ID of the created spreadsheet
            print(f'Created Spreadsheet with name: {spreadsheet.title} and ID: {spreadsheet.id}')

        
        self.increase_api_count('API call: open')
        spreadsheet = client.open(self.sheet_name)
        print(f'Spreadsheet {spreadsheet.title} already exists and will not be created')


        # Add course id columns to the spreadsheet -- we do this here in case we exceed rate limit after creating the sheet
        df  = self.read_sheet()
        if df.shape[0] == 0 :
            self.add_headers(spreadsheet.id)
       
        if email:
            logging.debug(f'Sharing sheet with {email}')
            # Share the spreadsheet with a specific email
            self.increase_api_count('API call: share')
            spreadsheet.share(email, perm_type='user', role='writer')
            print(f'Spreadsheet shared with {email}')
 
        # Return the ID of the created spreadsheet
        self.id = spreadsheet.id
        return spreadsheet.id

    @exponential_backoff
    def add_headers(self, spreadsheet_id):
        '''
        Adds headers to the first row of the specified Google Sheet.
        Args:
            spreadsheet_id (str): The ID of the Google Sheet to add headers to.
        Returns:
            None
        '''
        logging.debug('Adding headers to sheet')
        # Create a Google Sheets client
        client = self.client

        # Open the spreadsheet by ID
        self.increase_api_count('API call: open by key')
        spreadsheet = client.open_by_key(spreadsheet_id)

        # Select the first sheet
        self.increase_api_count('API call: get worksheet')
        sheet = spreadsheet.get_worksheet(0)

        # Define the values you want to write to the first row
        values = cp.columns

        # Update the first row with the new values
        self.increase_api_count('API call: update')
        sheet.update([values], 'A1')

        print(f'Headers added to the spreadsheet with ID: {spreadsheet_id}')

    @exponential_backoff
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

        logging.debug(f'Opening spreadsheet')
        # Open the spreadsheet by name
        self.increase_api_count('API call: open')
        spreadsheet = client.open(self.sheet_name)

        # Select the first sheet
        self.increase_api_count('API call: get worksheet')
        sheet = spreadsheet.get_worksheet(0)
        #Get the entire sheet
        self.increase_api_count('API call: get all records')
        data = sheet.get_all_records()

        #Make a pandas data from sheet
        df = pd.DataFrame(data)
        
        # df is empty if there is only a header row; handle this case
        if df.shape[0] == 0:
            print(f"Course ID '{course_id}' not found.")
            return None

        #Find row with the course id
        row = df[df['course_id'] == course_id]

        # Check if a row was found
        if row.empty:
            print(f"Course ID '{course_id}' not found.")
            return None
        
        logging.debug(f'Checking if columns is a list or a string')
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
            return self._convert_numpy_int64_to_int(cells_dict)
        #else we will return a single cell
        else:
            cell = row[columns].values[0]
            return cell

    @exponential_backoff
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
        logging.debug(f'Opening sheet')
        # Create a Google Sheets client
        client = self.client
        # Open the spreadsheet by name
        self.increase_api_count('API call: open')
        spreadsheet = client.open(self.sheet_name)

        # Select the first sheet
        self.increase_api_count('API call: get_worksheet')
        sheet = spreadsheet.get_worksheet(0) 

        # Get all records to check for existing course_id and column headers
        self.increase_api_count('API call: get all records')
        data = sheet.get_all_records()
        df = pd.DataFrame(data)

        # Get the current column headers from the sheet
        sheet_headers = sheet.row_values(1) 

        logging.debug(f'Looking for course id')
        # Find the row index for the course_id if it exists
        course_row_index = None
        if not df.empty and course_id in df['course_id'].values:
            course_row_index = df[df['course_id'] == course_id].index[0] + 2 # +1 for 1-based, +1 for header row

        #update last_edit columns
        logging.debug(f'Updating last_edit column')
        formatted_current_time = self._fetch_current_time()
        values_dict['last_edited'] = formatted_current_time

        
        if course_row_index:
            logging.debug(f'Updating row')
            print(f"Course ID '{course_id}' found. Updating existing row...")
            # Update existing record
            for column, new_val in values_dict.items():
                if column in sheet_headers:
                    col_index = sheet_headers.index(column) + 1 # Convert to 1-based index
                    sheet.update_cell(course_row_index, col_index, new_val)
                else:
                    print(f"Warning: Column '{column}' not found in sheet '{self.sheet_name}'. Skipping update for this column.")
        else:
            raise ValueError("Course does not exist. Please try a different course id.")
        print(f"Successfully processed values for course ID '{course_id}'.")

    #Used for testing purposes
    @exponential_backoff
    def read_sheet(self):
        '''
        Reads the entire Google Sheet and returns it as a pandas DataFrame.
        Returns:
            pd.DataFrame: A DataFrame containing all records from the Google Sheet.
        '''
        # Create a Google Sheets client
        client = self.create_gs_client()
        
        logging.debug(f'Opening spreadsheet')
        # Open the spreadsheet by name
        self.increase_api_count('API call: open')
        spreadsheet = client.open(self.sheet_name)

        print('API call: get worksheet')
        sheet = spreadsheet.get_worksheet(0)
        logging.info(f'getting all records from sheet')
        # Get all records
        self.increase_api_count('API call: get all records')
        records = sheet.get_all_records()

        # Convert to DataFrame for nice formatting
        df = pd.DataFrame(records)
        return self._convert_numpy_int64_to_int(df)

    @exponential_backoff
    def delete_sheet(self):
        '''
        Deletes the Google Sheet with the specified name.
        This function uses the Google Drive API to delete the sheet.
        Returns:
            None
        '''

        logging.debug(f'Opening Sheet')
    # Create a Google Sheets client
        client = self.create_gs_client()
        
        # Open the spreadsheet by name
        self.increase_api_count('API call: open')
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

        logging.info(f'Deleting Sheet')
        # Delete the specified spreadsheet
        drive_service.files().delete(fileId=spreadsheet_id).execute()
        # Print confirmation message
        logging.debug(f'Spreadsheet with Name: {self.sheet_name} and ID: {spreadsheet_id} deleted successfully.')

    @exponential_backoff
    def delete_all_sheets(self):
        '''
        Deletes all sheets owned by the client 
            (should only be used for debugging)
        '''
        logging.info(f'Deleting all sheets')
        self.increase_api_count('API call: list spreadsheet files')
        for f in self.client.list_spreadsheet_files() :
            try :
                self.increase_api_count('API call: delete spreadsheet')
                self.client.del_spreadsheet(f['id'])
                print(f'Deleted file {f["name"]} with id {f["id"]}')
            except :
                print(f'Could not delete file {f["name"]} with id {f["id"]}')
    
    def _convert_numpy_int64_to_int(self,obj):
        logging.debug('Converting numpy object to integer')
        if isinstance(obj, np.int64):
            return int(obj)
        elif isinstance(obj, dict):
            return {key: self._convert_numpy_int64_to_int(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_numpy_int64_to_int(item) for item in obj]
        else:
            return obj

    @staticmethod 
    def generate_test_data(sheet_name, n, email = None) :                
        '''
        Generates 'n' records for given sheet_name
        '''
        # TO DO: may need to update to handle created_at and last_edited
        logging.info(f'Generating test data')
        gs = gsEditor(sheet_name)
        gs.create_sheet(email)
        for i in range(1,n+1) :
            course_id = 'test' + str(i)
            d = {col: col + str(i) for col in cp.columns if col != 'course_id'}
            gs.createNewCourse(d)

    @staticmethod
    def _fetch_current_time():
        '''
        This function retrieves the current date and time and formats it.
        Args:
        None
        Returns:
        formatted_current_time: the formatted time
        '''
        logging.debug(f'Fetching current time')
        current_time = datetime.now()
        formatted_current_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_current_time
       
    def createNewCourse(self, values_dict: Dict[str, Any]):
        '''
        Creates a new course in the Google Sheet with the specified values.
        Args:
        values_dict (Dict[str, Any]): A dictionary containing column names as keys and the new
        Returns:
        str: The course ID of the newly created course.
        '''
        logging.info('Creating new course')
        logging.debug('Opening sheet ')
        # Create a Google Sheets client
        client = self.client
        # Open the spreadsheet by name
        self.increase_api_count('API call: open')
        spreadsheet = client.open(self.sheet_name)

        # Select the first sheet
        self.increase_api_count('API call: get_worksheet')
        sheet = spreadsheet.get_worksheet(0) 

        # Get all records to check for existing course_id and column headers
        self.increase_api_count('API call: get all records')
        data = sheet.get_all_records()
        df = pd.DataFrame(data)

        # Get the current column headers from the sheet
        sheet_headers = sheet.row_values(1) 

        # Initialize new row with None for all *known* sheet headers
        new_row_values = {}  
        for col in sheet_headers:
            new_row_values[col] = None

        logging.debug(f'Getting last course id and incrementing')
        # Generate new course id by incrementing from last course_id
        if df.empty or len(df) == 1 and df["course_id"].iloc[0] == df.columns[0]:
            # If the DataFrame is empty or only has headers, start with a default course_id
            new_num = 1  
        else:
            last_course_id = df["course_id"].iloc[-1]
            new_num = int(last_course_id[1:])+1
        new_course_id = f'c{new_num}'
        

        # Set the course_id in the new row
        new_row_values['course_id'] = new_course_id

        logging.debug(f'Update time create and edited columns')
        #Update created and edited columns
        formatted_current_time = self._fetch_current_time()
        values_dict['created_at'] = formatted_current_time
        values_dict['last_edited'] = formatted_current_time

        logging.debug(f'Add new row')
        # Add the provided values from values_dict
        for column, new_val in values_dict.items():
            if column in sheet_headers:
                new_row_values[column] = new_val
            else:
                print(f"Warning: Column '{column}' not found in sheet '{self.sheet_name}'.")

        # Ensure values are in the correct order for appending
        ordered_new_row = []  # Initialize an empty list to store the ordered values
        for header in sheet_headers:
            # Append the value from new_row_values or None if not present
            # This ensures that the new row matches the order of the headers
            value = new_row_values.get(header, None)
            ordered_new_row.append(value)
        # Append the new row to the sheet
        sheet.append_row(ordered_new_row)
        print(f"Successfully processed values for course ID '{new_course_id}'.")
        return new_course_id
        
