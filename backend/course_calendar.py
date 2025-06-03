# %%
"""
The 'course_calendar' module provides functionality for working with course
calendars for the Course Planning Tool, and includes a web scraper and 
calendar generator.

-- Example code for scraping a calendar:

url = 'https://www.easternct.edu/academics/academic-calendar/index.html'
target = 'Spring 2026'

soup = get_target_webpage(url, target)
df = get_dates(soup, target)
df

-- Example code for generating a schedule:

start_date = datetime.strptime('08/02/2014', "%m/%d/%Y").date()
end_date = datetime.strptime('07/15/2019', "%m/%d/%Y").date()

days = 'TR'

generate_schedule(start_date, end_date, days)

"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from io import StringIO
from datetime import datetime, timedelta

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

def generate_schedule(start_date, end_date, days):
    '''
    Returns a data frame for given days between start_date and end_date
    - start_date, end_date: datetime or date objects
    - days: string of days, e.g., MWF
    '''
   
    if start_date > end_date :
        raise Exception(f'Start date {start_date} must come before end date {end_date}')

    # convert days to full names
    days_dict = {'M': 'Monday',
             'T': 'Tuesday',
             'W': 'Wednesday',
             'R': 'Thursday',
             'F': 'Friday'}

    
    days = [days_dict[d] for d in days]
    

    # create data frame of days
    dates_list = []
    current_date = start_date
    while current_date <= end_date :
        day = current_date.strftime('%A')
        if day in days :
            dates_list.append((day, current_date.strftime('%m/%d/%Y')))
        current_date += timedelta(days = 1)

    df = pd.DataFrame(dates_list, columns = ['Day', 'Date'])
    return(df)
