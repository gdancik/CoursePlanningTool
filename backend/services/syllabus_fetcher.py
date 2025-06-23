import requests
from bs4 import BeautifulSoup
from docx import Document
from htmldocx import HtmlToDocx
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

                if re.search(i,str(key)):
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
