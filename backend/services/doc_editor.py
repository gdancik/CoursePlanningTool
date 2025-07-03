from docx import Document
import pandas as pd
import tabulate
from python_docx_replace import docx_replace, docx_blocks

import logging


#TODO Need to change to be more algorithmically efficient
#Currently it is O(n^2) because it iterates through the paragraphs for each key in the dictionary

def replaceTextInParagraph(doc, fr_dict):
    '''
    Replaces text in a Word document based on a dictionary of replacements.
    Args:
        doc: Word document object.
        fr_dict (dict): Dictionary containing text to be replaced as keys and their replacements as values.
        block_ls (list, optional): List of blocks to be removed. Defaults to None.
    '''
    logging.info('Replacing text in document')
    docx_replace(doc, **fr_dict)
        
def removeBlocks(doc, block_ls):
    '''
    Removes specified blocks from a Word document.
    Args:
        doc: Word document object.
        block_ls (list): List of blocks to be removed.
    Returns:
        None
    '''
    logging.info('Removing blocks from doc')
    for i in block_ls:
        options = {i: False}
    docx_blocks(doc, **options)
 
def printParagraphs(doc):
    '''
    Prints all paragraphs in a Word document.
    Args:
        doc: Word document object.
    Returns:
        None
    '''
    logging.info('Printing paragraphs')
    # Iterate through the paragraphs in the document and print them
    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()
        if text:  # Only print non-empty paragraphs
            print(text)

def getParagraph(doc, i):
    '''
    Retrieves a specific paragraph from a Word document.
    Args:
        doc: Word document object.
        i (int): Index of the paragraph to retrieve.
    Returns:
        str: Text of the specified paragraph.
    '''
    logging.info(f'Fetching paragraph {i}')
    paragraph = doc.paragraphs[i].text.strip()
    return paragraph
    
def print_table(t):
    '''
    Prints a DataFrame in a tabular format.
    Args:
        t (pd.DataFrame): DataFrame to be printed.
    Returns:
        None
    '''
    logging.info('Printing table')
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
        doc: Word document object.
    Returns:
        None
    '''
    logging.info('Printing all tables in the doc')
    
    # Iterate through the tables in the document and print them
    for i in range(len(doc.tables)):
        # Convert the table to a DataFrame
        table = getTable(doc, i)
        # Print the DataFrame in a tabular format
        print_table(table)

def getTable(doc, i):
    '''
    Retrieves a specific table from a Word document and converts it to a DataFrame.
    Args:
        doc: Word document object.
        i (int): Index of the table to retrieve.
    Returns:
        pd.DataFrame: DataFrame containing the table data.
    '''
    logging.info(f'Fetching table {i}')

    table = doc.tables[i]
   
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

from docx.shared import Pt, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
def copy_paragraph_before(source_paragraph,target_paragraph):
    # Extract text from the source paragraph
    text = source_paragraph.text
    link_index = None

    # Insert a new paragraph before the target paragraph in the target document
    new_paragraph = target_paragraph.insert_paragraph_before(text)
    if source_paragraph.style:
        new_paragraph.style = source_paragraph.style
    target_paragraph.clear()
    # Copy formatting from the source paragraph to the new paragraph
    if source_paragraph.runs:
        # Clear existing runs in the new paragraph
        new_paragraph.clear()
        for child in source_paragraph._element.iterchildren():
            if child.tag.endswith('hyperlink'):
                # Create a new hyperlink in the new paragraph
                logging.debug('Found link') #debug
                link_index= source_paragraph._element.index(child)
                link_text = source_paragraph._element.getchildren()[link_index].text
                logging.debug(f'link text:{link_text}')

        # Copy each run from the source paragraph to the new paragraph
        for i, run in enumerate(source_paragraph.runs):
            new_run = new_paragraph.add_run(run.text)
            new_run.bold = run.bold
            new_run.italic = run.italic
            new_run.underline = run.underline

            if i+1 == link_index:
                new_run.text += link_text
      
            # Check if the run is part of a hyperlink
            from lxml import etree
            current_run = run._element
            logging.debug(f'current_run:{current_run},run:{i}')#debug
           
                    
                

