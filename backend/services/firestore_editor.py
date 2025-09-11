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
import backend.services.firestore_stats as fs_stats

# create stat tables
fs_stats.create_tables()

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

    def set_collection_name(self, collection_name: str):
        '''
        Sets the name of the firestore collection to be used.
        Args:
            collection_name (str): The name of the collection to be created or managed.
        '''
        logging.info('Setting sheet name')
        if collection_name != self.collection_name :
            self.collection_name = collection_name

    def createNewCourse(self, values_dict: Dict[str, Any]):
        '''
        Creates a new course in the Firestore database with the provided values.
        Args:
            values_dict (Dict[str, Any]): A dictionary containing the course data to be added.            
        '''

        logging.info('Creating new course')
        logging.debug(f'Update time create and edited columns')
        values_dict['created_at'] = firestore.SERVER_TIMESTAMP
        values_dict['last_edited'] = firestore.SERVER_TIMESTAMP
       
        fs_stats.increase_number_writes(self.collection_name, 1)
        course_ref = self.client.collection(self.collection_name).add(values_dict)
        return course_ref[1].id

    def read_collection(self, return_json = False, id_only = False):
        '''
        Reads the entire sheet from the Firestore database and returns it as a pandas 
        DataFrame or dictionary if return_json is True; or if 'id_only' is True, 
        returns a list of ids
        Returns one of the following:
            Dict | pd.DataFrame: A Dict or DataFrame containing all the documents in the
                                 specified Firestore collection.
            list: A list of ids corresponding to all documents in the collection
        '''
        docs = self.client.collection(self.collection_name).stream()
        
        if id_only:
           docs = [doc.id for doc in docs]
           fs_stats.increase_number_reads(self.collection_name, len(docs))
           return docs
        
        docs = [(doc.id, doc) for doc in docs]
        
        fs_stats.increase_number_reads(self.collection_name, max(1,len(docs)))

        if len(docs) == 0 :          
            if return_json :
                return {}
            return pd.DataFrame(docs)
        
        sheet = [{'_course_id': id, **doc.to_dict()} for id, doc in docs]

        if return_json: 
            j = {r['_course_id']: {k:v for (k,v) in r.items() if k != '_course_id'} for r in sheet }
            return j
        
        df = pd.DataFrame(sheet).set_index('_course_id', drop = True)
        return df

    
    def getCourse(self, course_id) :
        ''''
        Returns a dictionary of values for the document with id of 'course_id'
        '''
        fs_stats.increase_number_reads(self.collection_name, 1)
        course_ref = self.client.collection(self.collection_name).document(course_id)
        course = course_ref.get()
        return course.to_dict()


    def getValue(self, course_id: str,columns: str) -> str:
        '''
        Retrieves a specific value or values from a course document in the Firestore database.
        Args:
            course_id (str): The course ID of the document to be accessed.
            columns (str or list): The specific column(s) to retrieve from the document.
        '''
        fs_stats.increase_number_reads(self.collection_name, 1)
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
        
        fs_stats.increase_number_reads(self.collection_name, 1)
        course_ref = self.client.collection(self.collection_name).document(course_id)
        values_dict['last_edited'] = firestore.SERVER_TIMESTAMP
 
        fs_stats.increase_number_writes(self.collection_name, 1)
        course_ref.update(values_dict)
       
    def duplicateCourse(self,original_course_id):
        '''
        Duplicates a course by creating a new course with the same data as the original course.

        Args:
            orginal_course_id (str): The course ID of the original course to be duplicated.
        Returns:
            new_course_id (str): The course ID of the newly created course.
        '''
        fs_stats.increase_number_reads(self.collection_name, 1)
        course_ref = self.client.collection(self.collection_name).document(original_course_id)
        course = course_ref.get()
        
        if not course.exists:
            raise Exception(f'Error: course does not exist: {original_course_id}')
        
        doc_data = course.to_dict()
        return self.createNewCourse(doc_data)
        

    def delete_course(self, course_id):
        '''
        Deletes a course document from the Firestore database.
        Args:
            course_id (str): The course ID of the document to be deleted.
        
        Note: firestore does not throw an error if the document doesn't exist!
        '''

        fs_stats.increase_number_deletes(self.collection_name, 1)
        course_ref = self.client.collection(self.collection_name).document(course_id)
        course_ref.delete()

        pass

    def delete_field(self, id, field) :
        '''
        Deletes 'field' from record with given 'id'. If 'id' is None,
        then the 'field' from all records in the collection are deleted
        '''
        if id :
            ref = self.client.collection(self.collection_name).document(id)
            fs_stats.increase_number_deletes(self.collection_name, 1)
            ref.update({field: firestore.DELETE_FIELD})
        else :
            ids = self.read_collection(id_only = True)
            for id in ids :
                self.delete_field(id, field)


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
            fs_stats.increase_number_reads(self.collection_name, 1)
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
            fs_stats.increase_number_deletes(self.collection_name, 1)
            doc.reference.delete()
        
        logging.info(f'Collection {self.collection_name} deleted successfully.')

    @staticmethod
    def get_all_collections() :
        client = fsEditor.create_fs_client()
        collections = client.collections()

        res = [collection.id for collection in collections]
        fs_stats.increase_number_reads('none', len(res))

        return res
        
    @staticmethod
    def delete_all_collections(collections) :
        '''static method to delete one or more collections
            - collections: name of single collection or a list
        '''
        if type(collections) != list :
            collections = list(collections)

        for collection in collections :
            client = fsEditor(collection)
            client.delete_collection()
          
    @staticmethod
    def read_all_collections() :
        '''
        Static method to read all collections
        Returns a dictionary in form
            collection_name: {collection data frame}
        '''

        res = {}
        collections = fsEditor.get_all_collections()
        for collection in collections :
            client = fsEditor(collection)
            res[collection] = client.read_collection()
        return res