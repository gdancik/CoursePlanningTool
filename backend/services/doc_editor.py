from docx import Document
import pandas as pd
import tabulate
from python_docx_replace import docx_replace, docx_blocks
from docx.shared import Pt, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import docx
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
#TODO ADD DOCSTRINGS
#REMOVE DEBUG TEXT
def copy_paragraph_before(source_paragraph, target_paragraph):
    def add_hyperlink(paragraph, text, url):
        def get_or_create_hyperlink_style(d):
            """If this document had no hyperlinks so far, the builtin
            Hyperlink style will likely be missing and we need to add it.
            There's no predefined value, different Word versions
            define it differently.
            This version is how Word 2019 defines it in the
            default theme, excluding a theme reference.
            """
            if "Hyperlink" not in d.styles:
                if "Default Character Font" not in d.styles:
                    ds = d.styles.add_style("Default Character Font",
                                            docx.enum.style.WD_STYLE_TYPE.CHARACTER,
                                            True)
                    ds.element.set(docx.oxml.shared.qn('w:default'), "1")
                    ds.priority = 1
                    ds.hidden = True
                    ds.unhide_when_used = True
                    del ds
                hs = d.styles.add_style("Hyperlink",
                                        docx.enum.style.WD_STYLE_TYPE.CHARACTER,
                                        True)
                hs.base_style = d.styles["Default Character Font"]
                hs.unhide_when_used = True
                hs.font.color.rgb = docx.shared.RGBColor(0x05, 0x63, 0xC1)
                hs.font.underline = True
                del hs

            return "Hyperlink"
        # This gets access to the document.xml.rels file and gets a new relation id value
        part = paragraph.part
        r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)

        # Create the w:hyperlink tag and add needed values
        hyperlink = docx.oxml.shared.OxmlElement('w:hyperlink')
        hyperlink.set(docx.oxml.shared.qn('r:id'), r_id, )

        # Create a new run object (a wrapper over a 'w:r' element)
        new_run = docx.text.run.Run(
            docx.oxml.shared.OxmlElement('w:r'), paragraph)
        new_run.text = text

        # Set the run's style to the builtin hyperlink style, defining it if necessary
        new_run.style = get_or_create_hyperlink_style(part.document)
        # Alternatively, set the run's formatting explicitly
        # new_run.font.color.rgb = docx.shared.RGBColor(0, 0, 255)
        # new_run.font.underline = True

        # Join all the xml elements together
        hyperlink.append(new_run._element)
        paragraph._p.append(hyperlink)
        return hyperlink
    
    # Extract text from the source paragraph
    text = source_paragraph.text
    link_index = None

    # Insert a new paragraph before the target paragraph in the target document
    # This new paragraph will initially contain the text from the source paragraph
    new_paragraph = target_paragraph.insert_paragraph_before(text)

    # Copy the style of the source paragraph to the new paragraph
    if source_paragraph.style:
        new_paragraph.style = source_paragraph.style

    # Clear the target paragraph as it will be rebuilt with the new content
    target_paragraph.clear()

    # Copy formatting from the source paragraph to the new paragraph
    if source_paragraph.runs:
        # Clear existing runs in the new paragraph to start fresh
        new_paragraph.clear()

        # Check if there is a hyperlink in the source paragraph and get its index and text
        for child in source_paragraph._element.iterchildren():
            # logging.debug(f'Paragraph child: {child}')#debug
            # Iterate through the XML elements of the source paragraph to find hyperlinks
            if child.tag.endswith('hyperlink'):
                # Log that a hyperlink has been found for debugging purposes
                logging.debug('Found link')#debug
                # Store the index of the hyperlink
                link_index = source_paragraph._element.index(child)
                # Extract the text of the hyperlink
                link_text = source_paragraph._element.getchildren()[link_index].text
                logging.debug(f'link text: {link_text}, link run: {link_index}')#debug

        # Copy each run from the source paragraph to the new paragraph
        for i, run in enumerate(source_paragraph.runs):
            # Add a new run to the new paragraph with the same text as the source run
            new_run = new_paragraph.add_run(run.text)

            # Copy the formatting properties (bold, italic, underline) from the source run
            new_run.bold = run.bold
            new_run.italic = run.italic
            new_run.underline = run.underline
            new_run.font.color.rgb = run.font.color.rgb
            new_run.font.size = run.font.size
            new_run.font.name = run.font.name
            # # If the current run index matches the hyperlink index, append the hyperlink text
            if i + 1 == link_index:
                if link_text.startswith("https://"):
                    add_hyperlink(new_paragraph,link_text,link_text)
                else:
                    link_text_url = f'https://{link_text}'
                    add_hyperlink(new_paragraph,link_text,link_text_url)
                   
                
            # if i + 1 == link_index:
            #     new_run.text += link_text

            # Check if the current run is part of a hyperlink using lxml for debug
            current_run = run._element
            logging.debug(f'current_run: {current_run}, run: {i}')  # Debugging log
                    
                

