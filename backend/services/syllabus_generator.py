import requests
from bs4 import BeautifulSoup
from docx import Document
from htmldocx import HtmlToDocx
from docx.shared import RGBColor, Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn 

import re
#%%
def get_webpage(url) :
    ''' 
    Returns the text from url, if valid.
    Args:
        url (str): The URL of the webpage to scrape.
    Returns:
        BeautifulSoup object: Parsed HTML content of the webpage.
    '''
    try :        
        r = requests.get(url)
    except Exception as error:
        # handle the exception
        print("An exception occurred:", error)

    if r.status_code != 200 :
        raise(f'Error with connection to {url}\n, status code is {r.status_code}')

    return BeautifulSoup(r.text, 'html.parser')

def extractFromAccordian(soup):
    '''
    Extracts headers and content from accordions in the given BeautifulSoup object.
    Args:
        soup (BeautifulSoup): Parsed HTML content of the webpage.
    Returns:
        dict: A dictionary where keys are headers and values are the corresponding content.
    '''
    headers_and_content = {}
    classes = soup.find_all(class_='accordion')
    for item in classes:
        rows = item.find_all(class_='row')
        for i in rows:
            header = i.find('h3')
            content = i.find_all('div', class_='content')
            headers_and_content[header] = content 
    return headers_and_content

def getStatements(url,selected_statements = None):
    '''
    Gets the syllabus statements from the given URL. by searching for the accordion classes then finding the rows and extracting the header and content.
    Args:
        url (str): The URL of the webpage to scrape.
        selected_statements (list, optional): A list of strings to filter the statements by their headers. If None, all statements are returned.
    Returns:
        dict: A dictionary where keys are headers and values are lists of content for the corresponding statements.
    '''
    soup = get_webpage(url)

    #get all statements
    all_statements = extractFromAccordian(soup)

    #Filter only the statements selected (Will have to search header for string)
    statments = all_statements
    if selected_statements:
        statments = {}
        for i in selected_statements:
            for key, val in all_statements.items():

                if i in str(key):
                    statments[key] = val
    #return selected statements
    return statments

def create_syllabus_statment_page(doc,url,selected_statements=None):
    '''
    Creates a syllabus statement page in the given Word document by fetching statements from a the syllabus statement website and adding them to the document.
    Args:
        doc (Document): The Word document object to which the syllabus statements will be added.
        url (str): The URL of the webpage to scrape for syllabus statements.
        selected_statements (list, optional): A list of strings to filter the statements by their headers. If None, all statements are returned.
    Returns:
        None
    '''
    x = getStatements(url,selected_statements)
    for header, content in x.items():
        header_string = str(header)
        content_string = str(list(content)[0])
        html_to_word_htmldocx(doc,header_string)
        html_to_word_htmldocx(doc,content_string)  

def html_to_word_htmldocx(doc,html_content):
    '''
    Converts HTML content to a Word document using the HtmlToDocx module and adds it to the specified document.
    Args:
        doc (Document): The Word document object to which the HTML content will be added.
        html_content (str): The HTML content to be converted and added to the document.
    Returns:
        None
    '''
    cleaned_html = _strip_whitespace_from_div(html_content)
    new_parser = HtmlToDocx()
    new_parser.add_html_to_document(cleaned_html,doc)

def _strip_whitespace_from_div(html_content):
    '''
    Strips unnecessary whitespace from HTML content, specifically around <p> and <div class="content"> tags.
    Args:
        html_content (str): The HTML content to be cleaned.
    Returns:
        str: Cleaned HTML content with unnecessary whitespace removed.
    '''
    stripped_html = re.sub(r'\s+(<p>)', r'\1', html_content)
    stripped_html = re.sub(r'(<\/p>)\s+', r'\1', stripped_html)  
    stripped_html = re.sub(r'(<\/div class="content">)\s+', r'\1', stripped_html)
    return stripped_html

def add_table_to_doc(doc, table_list:list, header = True):
    '''
    Adds a table to the given Word document using the provided list of lists.
    Args:
        doc (Document): The Word document object to which the table will be added.
        table_list (list of lists): A list of lists representing the table data.
        header (bool, optional): If True, the first row of table_list is treated as the header row. Defaults to True.
    Returns:
        
    '''
    table = doc.add_table(rows=len(table_list), cols=len(table_list[0]),style = "Table Grid")

    for i, row in enumerate(table_list):
        for j, cell_data in enumerate(row):
            table.cell(i, j).text = str(cell_data)

    if header == True:
        style_table_header(table)
   
    return table
    
def center_table_text(table):
    '''
    Centers the text in all cells of a specified table in the given Word document.
    Args:
        doc (Document): The Word document object containing the table.
        table (Table): The table object whose cell text will be centered.
    Returns:
        None
    '''
    for row in table.rows:
        for cell in row.cells:
            cell.paragraphs[0].alignment = 1  # 1 corresponds to center alignment

def style_table_borders(table):
    '''
    Styles the borders of a specified table in the given Word document.
    Args:
        doc (Document): The Word document object containing the table.
        table (Table): The table object whose borders will be styled.
    Returns:
        None
    '''
    for row in table.rows:
            for cell in row.cells:
                tcPr = cell._element.tcPr  # Get the table cell properties element
                if tcPr is None:
                    tcPr = OxmlElement('w:tcPr')
                    cell._element.append(tcPr)

            
                tcBorders = tcPr.find(qn('w:tcBorders'))
                if tcBorders is None:
                    tcBorders = OxmlElement('w:tcBorders')
                    tcPr.append(tcBorders)

                #Couldn't get the loop for this working so I just ran it for every cell - Sencere
                top_border = tcBorders.find(qn('w:top'))
                if top_border is None:
                    top_border = OxmlElement('w:top')
                    tcBorders.append(top_border)
                top_border.set(qn('w:val'), 'nil')

                #only set first column's left border to nil
                if cell._element.getparent().index(cell._element) == 0:
                    # Set the left border style to 'nil' (no border)
                    left_border = tcBorders.find(qn('w:left'))
                    if left_border is None:
                        left_border = OxmlElement('w:left')
                        tcBorders.append(left_border)
                    left_border.set(qn('w:val'), 'nil')

                #only set last column's right border to nil
                if cell._element.getparent().index(cell._element) == len(row.cells) - 1:
                    # Set the right border style to 'nil' (no border)
                    right_border = tcBorders.find(qn('w:right'))
                    if right_border is None:
                        right_border = OxmlElement('w:right')
                        tcBorders.append(right_border)
                    right_border.set(qn('w:val'), 'nil')

def style_table_text(table):
    '''
    Changes the font, size, and color of all text in a specified table in the given Word document.
    Args:
        table (Table): The table object whose font will be changed.
    Returns:
        None
    '''
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
                run.font.size = Pt(11)
                run.font.name = 'Calibri'
                run.font.color.rgb = RGBColor(0, 0, 0)
                
def style_table_header(table):
    '''
    Changes the font of the header row in a specified table in the given Word document.
    Args:
        table (Table): The table object whose header font will be changed.
    Returns:
        None
    '''
    header_row = table.rows[0]
    for cell in header_row.cells:
        for paragraph in cell.paragraphs:
            run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
            run.bold = True
            run.font.color.rgb = RGBColor(32, 44, 92)
            run.font.size = Pt(12)
            # paragraph.alignment = 1  # Center align the header text

def add_styled_table(doc, table_list:list, header = True, center = False):
    '''
    Adds a styled table to the given Word document using the provided list of lists.
    Args:
        doc (Document): The Word document object to which the table will be added.  
        table_list (list of lists): A list of lists representing the table data.
        header (bool, optional): If True, the first row of table_list is treated as the header row. Defaults to True.
        center (bool, optional): If True, the text in the table will be centered. Defaults to False.
    Returns:
        table (Table): The created and styled table object.
    '''
    # Make table
    table = add_table_to_doc(doc, table_list, header)
    # Style table
    style_table_borders(table)
    if center == True:
        center_table_text(table)
    style_table_text(table)
    style_table_header(table)

    return table
