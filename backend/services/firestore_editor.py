"""
This module provides functions to create and manage Firestore collections and documents as courses for population in a syllabus.
It includes functions to create a new courses, get and update values in a course, and delete courses.
It requires a service account with access to the Google firebase firestore API, which can be set up in the 
Google Cloud Console. The module will use the json file from the service account to authenticate and access the 
API by storing the json file in an environment variable named `GS_CREDENTIALS_JSON`.
"""
import os
import json
import firebase_admin
import pandas as pd

from firebase_admin import credentials
from firebase_admin import firestore
import logging
from typing import Dict, Any
import backend.services.course_planning as cp

class fsEditor:
    '''
    A class to interact with a Firestore database, specifically for managing course data.
    Attributes:
        collection_name (str): The name of the collection to be created or managed.
        client (): The Firestore client used to interact with the database.
    '''

    def __init__(self, collection_name: str):
        '''
        Initializes the fsEditor with a specified sheet name and creates a Firestore client.
        Args:
            collection_name (str): The name of the collection to be created or managed.
        '''
        self.collection_name = collection_name
        self.client = self.create_fs_client()


    @staticmethod
    def create_fs_client():
        '''
        Creates a Firestore client using the Firebase Admin SDK.
        Returns:
            firestore.client: The Firestore client used to interact with the database.
        '''
        logging.info('Creating FS client')
          # Check if a Firebase app is already initialized
        if not firebase_admin._apps:
            # Access the environmental variable
            service_account_info = os.getenv('GS_CREDENTIALS_JSON')
            if service_account_info:
                # Parse the JSON string into a dictionary
                service_account = json.loads(service_account_info)
                # Initialize Firebase Admin SDK
                cred = credentials.Certificate(service_account)
                # Initialize the Firebase app
                firebase_admin.initialize_app(cred)
            else:
                # If the environmental variable is not set, handle it accordingly
                raise ValueError("No service account credentials found in environmental variables.")

        # Get the default Firestore client
        client = firestore.client()
        return client

    def set_collection_name(self, collection_name: str="CPT_Data"):
        '''
        Sets the name of the firestore collection to be used.
        Args:
            collection_name (str): The name of the collection to be created or managed.
        '''
        logging.info('Setting sheet name')
        if collection_name != self.collection_name :
            self.collection_name = collection_name

    def createNewCourse(self, values_dict: Dict[str, Any],course_id: str = None):
        '''
        Creates a new course in the Firestore database with the provided values.
        Args:
            values_dict (Dict[str, Any]): A dictionary containing the course data to be added.
            course_id (str, optional): The course ID to be used for the new course. If not provided, a new document will be created with a generated ID.
        '''

        logging.info('Creating new course')
        logging.debug(f'Update time create and edited columns')
        values_dict['created_at'] = firestore.SERVER_TIMESTAMP
        values_dict['last_edited'] = firestore.SERVER_TIMESTAMP
        validated_dict =  {}
        valid_col = cp.columns
       
       #check if cols are valid
        for key, val in values_dict.items():
            if key in valid_col:
                validated_dict[key] = val
            else:
                logging.warning(f'Column: {key} not a valid column, skipping this column')

        course_ref = self.client.collection(self.collection_name).add(validated_dict)
        return course_ref[1].id

    def read_collection(self):
        '''
        Reads the entire sheet from the Firestore database and returns it as a pandas DataFrame.
        Returns:
            pd.DataFrame: A DataFrame containing all the documents in the specified Firestore collection.
        '''
        docs = self.client.collection(self.collection_name).stream()
        sheet = [{**doc.to_dict()} for doc in docs]
        df = pd.DataFrame(sheet)
        return df

    def getValue(self, course_id: str,columns: str) -> str:
        '''
        Retrieves a specific value or values from a course document in the Firestore database.
        Args:
            course_id (str): The course ID of the document to be accessed.
            columns (str or list): The specific column(s) to retrieve from the document.
        '''
        course_ref = self.client.collection(self.collection_name).document(course_id)
        course = course_ref.get()
        if course.exists:
            doc_data = course.to_dict()
        else:
            logging.error('Course not found')
            return None

        if isinstance(columns, list):
            cells = {} 
            for key in columns:

                cells[key] = doc_data.get(key)
            return cells
        #else we will return a single cell
        else:
            cell = doc_data.get(columns)
            return cell

    def updateValue(self, course_id: str, values_dict: Dict[str, Any]):
        '''
        Updates a specific course document in the Firestore database with new values.
        Args:
            course_id (str): The course ID of the document to be updated.
            values_dict (Dict[str, Any]): A dictionary containing the new values to be updated in the document.
        '''
        
        course_ref = self.client.collection(self.collection_name).document(course_id)
        values_dict['last_edited'] = firestore.SERVER_TIMESTAMP

        validated_dict =  {}
        valid_col = cp.columns
       
       #check if cols are valid
        for key, val in values_dict.items():
            if key in valid_col:
                validated_dict[key] = val
            else:
                logging.warning(f'Column: {key} not a valid column, skipping this column')

        course_ref.update(validated_dict)
       
    def duplicateCourse(self,orginal_course_id):
        '''
        Duplicates a course by creating a new course with the same data as the original course.

        Args:
            orginal_course_id (str): The course ID of the original course to be duplicated.
        Returns:
            new_course_id (str): The course ID of the newly created course.
        '''
        course_ref = self.client.collection(self.collection_name).document(orginal_course_id)
        course = course_ref.get()

        if course.exists:
            doc_data = course.to_dict()

        self.createNewCourse(doc_data)

    def delete_course(self, course_id):
        '''
        Deletes a course document from the Firestore database.
        Args:
            course_id (str): The course ID of the document to be deleted.
        '''
        course_ref = self.client.collection(self.collection_name).document(course_id)
        course_ref.delete()

        pass

    def collection_exists(self,):
        '''
        Checks if specified collection exist in the firestore database by attempting to retrieve one document.
        Returns:
            bool: True if the collection exists, False otherwise.
        '''
        logging.info(f'Checking if collection {self.collection_name} exists')
        try:
            # Get a reference to the collection
            collection_ref = self.client.collection(self.collection_name)

            # Attempt to retrieve one document
            docs = collection_ref.limit(1).stream()

            # Check if any document exists
            return any(True for _ in docs)
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

    def delete_collection(self):
        '''
        Deletes the entire collection from the Firestore database.
        '''
        logging.info(f'Deleting collection {self.collection_name}')
        collection_ref = self.client.collection(self.collection_name)
        docs = collection_ref.stream()
        
        for doc in docs:
            doc.reference.delete()
        
        logging.info(f'Collection {self.collection_name} deleted successfully.')
