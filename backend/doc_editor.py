from docx import Document
import pandas as pd
import tabulate
from python_docx_replace import docx_replace, docx_blocks

#TODO Need to change to be more algorithmically efficient
#Currently it is O(n^2) because it iterates through the paragraphs for each key in the dictionary

def replaceTextInParagraph(doc, fr_dict,block_ls=None):
    '''
    Replaces text in a Word document based on a dictionary of replacements.
    Args:
        doc (str): Word document object.
        fr_dict (dict): Dictionary containing text to be replaced as keys and their replacements as values.
        block_ls (list, optional): List of blocks to be removed. Defaults to None.
    '''
    document = doc
    docx_replace(document, **fr_dict)
    
    if block_ls:
        for i in block_ls:
            options = {i: False}
        docx_blocks(document, **options)
 
def printParagraphs(doc):
    '''
    Prints all paragraphs in a Word document.
    Args:
        doc (str): Path to the Word document.
    Returns:
        None
    '''
    # Open the document
    document = Document(doc)
    # Iterate through the paragraphs in the document and print them
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if text:  # Only print non-empty paragraphs
            print(text)

def getParagraph(doc, i):
    '''
    Retrieves a specific paragraph from a Word document.
    Args:
        doc (str): Path to the Word document.
        i (int): Index of the paragraph to retrieve.
    Returns:
        str: Text of the specified paragraph.
    '''
    # Open the document
    document = Document(doc)
    
    paragraph = document.paragraphs[i].text.strip()
    return paragraph
    
def print_table(t):
    '''
    Prints a DataFrame in a tabular format.
    Args:
        t (pd.DataFrame): DataFrame to be printed.
    Returns:
        None
    '''
    #Check if t is a DataFrame
    if not isinstance(t, pd.DataFrame):
        raise ValueError("Input must be a pandas DataFrame.")

    # Convert the DataFrame to a tabular format using tabulate
    table = tabulate.tabulate(t, headers='keys', tablefmt='grid')
    # Print the table
    print(table)

def printTables(doc):
    '''
    Prints all tables in a Word document in a tabular format.
    Args:
        doc (str): Path to the Word document.
    Returns:
        None
    '''
    # Open the document
    document = Document(doc)
    # Iterate through the tables in the document and print them
    for i in range(len(document.tables)):
        # Convert the table to a DataFrame
        table = getTable(doc, i)
        # Print the DataFrame in a tabular format
        print_table(table)

def getTable(doc, i):
    '''
    Retrieves a specific table from a Word document and converts it to a DataFrame.
    Args:
        doc (str): Path to the Word document.
        i (int): Index of the table to retrieve.
    Returns:
        pd.DataFrame: DataFrame containing the table data.
    '''
    # Open the document
    document = Document(doc)
    table = document.tables[i]
   
    # Initialize an empty list to store rows
    rows = []
    # Iterate over each row in the table
    for row in table.rows:
        # Initialize an empty list to store cell contents for the current row
        row_data = []

        # Iterate over each cell in the current row
        for cell in row.cells:
            # Strip the text content of the cell and add it to the row_data list
            row_data.append(cell.text.strip())

        # Add the row_data list to the rows list
        rows.append(row_data)

    # Create a DataFrame from the list of rows
    df = pd.DataFrame(rows)
    return df


