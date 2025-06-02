# %%
"""
The 'course_calendar' module provides functionality for working with course
calendars for the Course Planning Tool, and includes a web scraper and 
calendar generator.

Example code for scraping a calendar:

url = 'https://www.easternct.edu/academics/academic-calendar/index.html'
target = 'Spring 2026'

soup = get_target_webpage(url, target)
df = get_dates(soup, target)
df
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from io import StringIO

def get_webpage(url) :
    ''' Returns the text from url, if valid. '''
    try :        
        r = requests.get(url)
    except Exception as error:
        # handle the exception
        print("An exception occurred:", error)

    if r.status_code != 200 :
        raise(f'Error with connection to {url}\n, status code is {r.status_code}')

    return BeautifulSoup(r.text, 'html.parser')



# %%
def get_target_webpage(url, target):
    
    soup = get_webpage(url)

    if not soup.table.find('td', string = target) :
        a = soup.find(lambda element: element.name =='a' and 'Upcoming Academic Calendar' in element.text.strip())

        if not a :
            raise Exception('Upcoming calendar not found')

        i = url.rfind('/')
        url = url[:i] + '/' + a['href']

        soup = get_webpage(url)
    return soup



# %%
def get_dates(soup, target_semester):
    '''Returns the target table as a data frame'''
    for t in soup.find_all('table')[1:] :
        if t.td.text.strip() == target_semester :           
            df = pd.read_html(StringIO(str(t)))[0]
            df.rename(columns = {df.columns[1]: 'Description'}, inplace = True)
            return df

    raise Exception(f'Term {target_semester} not found in current or upcoming urls')
    return None

# %%






