import requests
from bs4 import BeautifulSoup

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
            # print('===='*20)
            # print(i.get_text(separator=" | ",strip=True))
            header = i.find('h3').get_text(strip=True)
            content = i.find_all('div', class_='content')
            all_content =""
            for line in content:
                all_content += line.get_text(strip=True)
            headers_and_content[header] = all_content
    return headers_and_content

def getStatements(url):
    '''
    Gets the syllabus statements from the given URL. by searching for the accordion classes then finding the rows and extracting the header and content.
    Args:
        url (str): The URL of the webpage to scrape.
    Returns:
        dict: A dictionary where keys are headers and values are the corresponding content from the accordions.
    '''
    soup = get_webpage(url)
    return extractFromAccordian(soup)
