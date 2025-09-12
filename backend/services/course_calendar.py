# %%
"""
The 'course_calendar' module provides functionality for working with course
calendars for the Course Planning Tool, and includes a web scraper and 
calendar generator.

-- Example code for creating a schedule (single function):
term = 'Spring'
year = '2026'
target = term + ' ' + year
url = 'https://www.easternct.edu/academics/academic-calendar/index.html'

schedule = create_schedule(term, year, url)

-- Example code for creating a schedule (step by step):
term = 'Spring'
year = '2026'
target = term + ' ' + year
url = 'https://www.easternct.edu/academics/academic-calendar/index.html'


soup = get_target_webpage(url, target)

df_calendar = get_dates(soup, target)
df_calendar = process_academic_calendar(df_calendar, target, year)

start, end = get_start_and_end_dates(df_calendar)

df_schedule = generate_schedule(start, end, 'MWF')

schedule = combine_date_dfs(df_schedule,  df_calendar, start, end)


-- Example code for generating a schedule (no academic calendar):

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
import numpy as np
import logging


def create_schedule(term, year, days, url = 'https://www.easternct.edu/academics/academic-calendar/index.html') :
    '''
    Creates a table for the course schedule, 
    integrated with the academic calendar, for the
    given term (e.g., 'Fall'), year (e.g., '2025') and days (e.g., 'MWF')
    '''

    logging.info('Creating Schedule')
    target = term + ' ' + year

    soup = get_target_webpage(url, target)

    df_calendar = get_dates(soup, target)
    df_calendar = process_academic_calendar(df_calendar, target, year)

    start, end = get_start_and_end_dates(df_calendar)

    df_schedule = generate_schedule(start, end, days)

    schedule = combine_date_dfs(df_schedule,  df_calendar, start, end)
    return schedule


def get_webpage(url) :
    ''' Returns the text from url, if valid. '''
    logging.info('Fetching webpage')
    try :        
        r = requests.get(url)
    except Exception as error:
        # handle the exception
        logging.error("An exception occurred:", error)

    if r.status_code != 200 :
        raise(f'Error with connection to {url}\n, status code is {r.status_code}')

    return BeautifulSoup(r.text, 'html.parser')



# %%
def get_target_webpage(url, target):
    
    soup = get_webpage(url)
    logging.info('Getting target webpage')
    if not soup.table.find('td', string = target) :
        a = soup.find(lambda element: element.name =='a' and 'Upcoming Academic Calendar' in element.text.strip())

        if not a :
            raise Exception(f'Calendar for {target} not found')

        i = url.rfind('/')
        url = url[:i] + '/' + a['href']

        soup = get_webpage(url)
    return soup



# %%
def get_dates(soup, target_semester):
    '''Returns the target table as a data frame'''

    logging.info('Getting table for target semester')

    for t in soup.find_all('table')[1:] :
        if t.td.text.strip() == target_semester :           
            df = pd.read_html(StringIO(str(t)))[0]
            df.rename(columns = {df.columns[1]: 'Description'}, inplace = True)
            return df

    raise Exception(f'Term {target_semester} not found in current or upcoming urls')
    return None

def filter_non_relevant_dates(df, col = 'Description'):
    '''
    Filters the data frame (df) by removing non-relevant dates, looking at 'col'
    and returns the updated data frame
    '''
    logging.info('Filtering out non-relevant dates')
    # descriptions containing these terms (case insensitive) are removed 
    removeList = ['Faculty', 'University Meeting', 'Orientation',
              'Academic Year', '%', 'Internship', 'Advis', 'audit',
              'Incomplete', 'Mid-semester', 'degree', 'Bookstore', 'Semester',
              'Exams', 'Commencement', 'Final grades', 'Memorial Day'
              ]

    pattern = '|'.join(removeList)

    return df[~df.iloc[:,1].str.contains(pattern, case = False, na = False)]

def clean_dates(x) :
    '''
    Returns a 'cleaned' version of list/series 'x' with 
    Jan. replaced by January, etc
    '''

    replace_dict = {r'Jan\.': 'January',
                    r'Feb\.': 'February',
                    r'Aug\.': 'August',
                    r'Sep\.': 'September',
                    r'Sept\.': 'September',
                    r'Oct\.': 'October',
                    r'Nov\.': 'November',
                    r'Dec\.': 'December'}
    x = x.replace(replace_dict, regex = True)
    return x

def add_date_column(df, col, year) :
    '''
    Copies column 'col' to df['Date'] and adds year, then
    converts to a datetime object; for date spans, 
    e.g., Feb 1 - Feb 4, only first date is used.
    '''

    df['Date'] = df[col]
    df['Date'] = df['Date'].apply(lambda x: x.split('–')[0])
    df['Date'] = df['Date'].apply(lambda x: x.split('-')[0])
    df['Date'] = df['Date'].apply(lambda x: x.strip() + ', ' + year)
    
    df['Date'] = clean_dates(df['Date'])
    df['Date'] = pd.to_datetime(df['Date'])
    df['Day'] = df['Date'].apply(lambda x: x.strftime('%A'))

    return df

def combine_date_dfs(df1, df2, start, end) :
    '''
    Combines two data frames and sorts by 'Date' column.
    This is used to combine the Academic Calendar Dates with
    the course schedule.
    
    Returns a data frame with columns 'Day', 'Date', and 'Description', containing
    only dates between start and end
    '''

    # combine columns
    combined = pd.concat([df1, df2])
    
    # sort by date
    combined = combined.sort_values('Date')

    # remove anything prior to starting date or after ending date
    combined = combined[combined['Date'] >= start]
    combined = combined[combined['Date'] <=  end]

    # reformat dates and hyphenate if applicable
    combined[['Date','Date2']] = combined[['Date','Date2']].map(lambda x: x.strftime('%m/%d/%Y') if isinstance(x, pd.Timestamp) else x)
    combined['Date'] = combined[['Date','Date2']].apply(hyphenate, axis = 1)
    
    return combined[['Day', 'Date', 'Description']].fillna('')


def get_start_and_end_dates(df):
    logging.debug('Fetching start and end dates')
    cc = df['Description'].str.contains('Classes Begin|Last Day of classes', case = False, na = False)
    df_range = df.loc[cc,:]  
    if df_range.shape[0] != 2 :
        raise Exception('Error: count not get start/end date of term')
    
    return tuple(df_range['Date'])

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
            #dates_list.append((day, current_date.strftime('%m/%d/%Y')))
            dates_list.append((day, current_date))
        current_date += timedelta(days = 1)

    df = pd.DataFrame(dates_list, columns = ['Day', 'Date'])
    return(df)

def format_date_string(s) :
    '''
    Formats date from, e.g.  'January 2, 2026' to '01/02/2026'
    '''
    
    # convert to datetime object
    d = datetime.strptime(s, '%B %d, %Y')

    # Format to m/d/yyyy
    d = datetime.strftime(d, '%m/%-d/%Y')  

    return d


def format_joint_date_string(s, year, check) :
    '''
    For formatting joint date strings, e.g., January 1 - January 3.
    If 'check' is True, then returns boolean series with True corresponding
        to values in 's' that are joint dates
    Otherwise, formatted date strings are returned
    '''

    if check and pd.isna(s) :
        return False
        
    if '–' in s :
        l = s.split('–')        
    elif '-' in s :
        l = s.split('-')
    else :
        if check :
            return False
        return s

    if check :
        return True

    if l[1].strip()[0].isdigit() :
        l[1] = l[0].split()[0].strip() + l[1]
    formatted = [x.strip() + ', ' + year for x in l]
    formatted = [format_date_string(f) for f in formatted]
    return ' - '.join(formatted)


def split_by_hyphen(x) :
    '''Returns a tuple split by a dash or long dash'''
    '''If no hyphen is found, the second return value is the empty string'''
    if '–' in x :
        return (x.split('–'))
    elif '-' in x :
        return x.split('-')
    else :
        return (x, '')

def copy_month(x):
    '''
    Takes tuple 'x' and returns a tuple with month copied from x[0] if necessary
    Ex: ('Feb 4', '6') --> ('Feb 4', 'Feb 6')
    '''
    x1,x2 = x
    if x2.strip().isdigit() :
        x2 = x[0].split()[0] + x2
    return x1,x2

def add_year(x, year) :
    '''
    Takes tuple 'x' and returns a tuple with year added if appropriate
    Ex: ('Feb 4', 'Feb 6') --> ('Feb 4, 2025', 'Feb 6, 2025')
    '''
    if x.strip() == '' :
        return x
    return x.strip() + ', ' + year

def hyphenate(r) :
    '''
    Takes a row of form (r0,r1) and returns r0 - r1 if r1 is not empty
    Must be used with a data frame, e.g., 
        dates_df[['Day','Day2']].apply(combine_cols, axis = 1)
    '''

    if pd.isna(r.iloc[1]) or r.iloc[1] == '' :
        return r.iloc[0]
    return str(r.iloc[0]) + ' - ' + str(r.iloc[1])   


def process_academic_calendar(df, target, year):
    '''
    Takes a df with target (e.g., 'Fall 2025') and 'Description' columns
    Returns a data frame with non-relevant dates removed, and the following:
      - 'Date' and 'Date2' as timedate values
      - 'Day' corresponding day of the week, possibly hyphenated
      - 'Description (unchanged)
    '''
    

    df = filter_non_relevant_dates(df)
    dates = df[target]

    # create two date columns
    dates = dates.apply(split_by_hyphen)

    # copy month when format is e.g., Feb 1 - 4
    dates = dates.apply(copy_month)
    dates_df = pd.DataFrame(list(dates), columns = ['Date', 'Date2'])

    # add the year and clean, e.g., Feb. 1 --> February 1, 2025
    dates_df = dates_df[['Date','Date2']].map(add_year, year = year)
    dates_df = dates_df[['Date','Date2']].apply(clean_dates)

    # format dates, e.g., February 1, 2025 --> 02/01/2025
    #dates_df = dates_df.map(lambda x: format_date_string(x) if x != '' else x)

    dates_df = dates_df.map(lambda x: pd.to_datetime(x) if x != '' else x)

    # add days
    dates_df[['Day','Day2']] = dates_df.map(lambda x: x.strftime('%A') if x != '' else x)

    # combine days, e.g., Monday - Wednesday
    dates_df['Day'] = dates_df[['Day','Day2']].apply(hyphenate, axis = 1)

    dates_df['Description'] = list(df['Description'])
    return dates_df.drop('Day2', axis = 1)
