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
df_calendar = process_academic_calendar(df_calendar, target, year, start_date)

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

# Add option to toggle on/off in UI
include_year = False
abbreviate_days = False
include_final_exam = True
by_week = False

# Day abbreviations
DAY_ABBREVIATIONS = {
    'Monday': 'M',
    'Tuesday': 'T', 
    'Wednesday': 'W',
    'Thursday': 'R',
    'Friday': 'F',
    'Saturday': 'S',
    'Sunday': 'U'
}

def create_schedule(term, year, days, class_time, url = 'https://www.easternct.edu/academics/academic-calendar/index.html') :
    '''
    Creates a table for the course schedule, 
    integrated with the academic calendar, for the
    given term (e.g., 'Fall'), year (e.g., '2025') and days (e.g., 'MWF')
    '''

    logging.info('Creating Schedule')
    target = term + ' ' + year

    # get the academic calendar
    soup = get_target_webpage(url, target)

    df_calendar = get_dates(soup, target)
    
    df_calendar = process_academic_calendar(df_calendar, target, year)

    start, end = get_start_and_end_dates(df_calendar)
    
    # Add week numbers if needed
    if by_week:
        first_monday = start - timedelta(days=start.weekday())
        def calculate_week_number(date_val):
            if date_val == '' or pd.isna(date_val):
                return ''
            days_since_first_monday = (date_val - first_monday).days
            return (days_since_first_monday // 7) + 1
        
        # Set the week numbers
        df_calendar['Day'] = df_calendar['Date'].apply(calculate_week_number)

    df_schedule = generate_schedule(start, end, days)

    schedule = combine_date_dfs(df_schedule,  df_calendar, start, end)
    
    # Add final exam information if enabled
    if include_final_exam and class_time:
        final_exam_info = get_final_exam_date('https://www.easternct.edu/registrar/final-examinations.html', target, days, class_time)
        
        if final_exam_info:
            # Add final exam to the schedule
            if by_week:
                # Parse the exam date
                date_parts = final_exam_info['date'].split()
                if len(date_parts) >= 3:
                    exam_date_str = f"{date_parts[1]} {date_parts[2]}, {year}" 
                else:
                    exam_date_str = f"{final_exam_info['date']}, {year}"
                    
                exam_date = pd.to_datetime(exam_date_str)
                
                days_since_first_monday = (exam_date - first_monday).days
                exam_week_number = (days_since_first_monday // 7) + 1
                
                final_exam_row = pd.DataFrame([{
                    'Week #': exam_week_number,
                    'Week of': exam_date.strftime('%m/%d'),
                    'Description': f"FINAL EXAM - {final_exam_info['day']} {exam_date.strftime('%m/%d')} - {final_exam_info['test_period_info']}"
                }])
            else:
                # Regular format
                final_exam_row = pd.DataFrame([{
                    'Day': final_exam_info['day'],
                    'Date': final_exam_info['date'].split()[-1],  # Get just the date part
                    'Description': f"FINAL EXAM - {final_exam_info['test_period_info']}"
                }])
            
            # Add the final exam row to the schedule
            schedule = pd.concat([schedule, final_exam_row], ignore_index=True)
    
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


def get_target_webpage(url, target):
    
    soup = get_webpage(url)
    logging.info('Getting target webpage')
    if not soup.table.find('td', string = target) :
        a = soup.find(lambda element: element.name =='a' and 'Upcoming Academic Calendar' in element.text.strip())

        if not a :
            raise Exception('Upcoming calendar not found')

        i = url.rfind('/')
        url = url[:i] + '/' + a['href']

        soup = get_webpage(url)
    return soup

def get_final_exam_date(url, target_semester, days, class_time):
    soup = get_webpage(url)

    # Check the final exam date matches the target semester
    curr_semester = soup.find_all(class_='main')
    print(f'Current semester: {curr_semester[0].text.strip()}')
    print(f'Target semester: {target_semester}')
    if curr_semester[0].text.strip() != target_semester :
        print('Current semester does not match target semester')
        return None
    else:
        print('Current semester matches target semester')
        # The test period is the class days and time which will match a cell in the exam table
        test_period = days + ' ' + class_time
        print(f'Test period: {test_period}')
        
        # Find the exam table
        exam_table = soup.find('table', class_='tablesaw tablesaw-stack table-dark')
        if not exam_table:
            print('Exam table not found')
            return None
            
        # Get all rows in the table
        rows = exam_table.find_all('tr')
        
        # Get header row to find day columns
        header_row = rows[0] if rows else None
        if not header_row:
            print('No header row found')
            return None
            
        # Find column indices for days 
        headers = header_row.find_all(['td'])
        day_columns = {}
        for i, header in enumerate(headers):
            header_text = header.text.strip()
            
            # Check if any day name is in the header text
            for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']:
                if day in header_text:
                    day_columns[day] = i
                    break
        
        # Search through data rows
        for row in rows[1:]:  # Skip header row
            cells = row.find_all(['td'])
            
            # Check each day column for our test period
            for day_name, col_index in day_columns.items():
                if col_index < len(cells):
                    cell_text = cells[col_index].text.strip()
                    if test_period in cell_text:
                        # Also get the date from the header
                        date_text = headers[col_index].text.strip()
                        # Get the test period and time from the first column 
                        test_period_info = cells[0].text.strip() if len(cells) > 0 else ""
                        print(f'Test period found in {day_name}: {cell_text}')
                        print(f'Test period info: {test_period_info}')
                        return {
                            'day': day_name,
                            'date': date_text.replace('\n', ' '),
                            'test_period_info': test_period_info,
                            'exam_info': cell_text,
                            'full_text': f'{day_name} {date_text.replace(chr(10), " ")} - {test_period_info}: {cell_text}'
                        }
        
        print('Test period not found in any day column')
        return None

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
              'Incomplete', 'Mid-semester', 'degree', 'Bookstore',
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
    
    # if abbreviate_days is True, then use the abbreviated day of the week
    if abbreviate_days:
        df['Day'] = df['Date'].apply(lambda x: DAY_ABBREVIATIONS[x.strftime('%A')])
    else:
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

    # Ensure both DataFrames have matching column structures
    # df1 (schedule) might have ['Week #', 'Week of', 'Description'] or ['Day', 'Date', 'Description']
    # df2 (calendar) has ['Date', 'Date2', 'Day', 'Description']
    
    if by_week:
        df1_formatted = df1.copy()
        df1_formatted = df1_formatted.rename(columns={'Week #': 'Day', 'Week of': 'Date'})
    else:
        df1_formatted = df1.copy()
        df1_formatted = df1_formatted.rename(columns={'Day': 'Week #', 'Date': 'Week of'})

    # Ensure df1 has all required columns that df2 has
    if 'Date2' not in df1_formatted.columns:
        df1_formatted['Date2'] = ''

    # combine columns
    combined = pd.concat([df1_formatted, df2])
    
    # sort by date
    combined = combined.sort_values('Date')

    # remove anything prior to starting date or after ending date
    combined = combined[combined['Date'] >= start]
    combined = combined[combined['Date'] <=  end]

    if by_week:
        combined['Description'] = combined['Description'] + " " + combined['Date'].apply(lambda x: x.strftime('%m/%d/%Y'))
        combined['Date'] = combined['Date'].apply(lambda x: x - timedelta(days=x.weekday()) if isinstance(x, pd.Timestamp) else x)
    if include_year == True:
        combined['Date'] = combined['Date'].apply(lambda x: x.strftime('%m/%d/%Y') if isinstance(x, pd.Timestamp) else x)
        if 'Date2' in combined.columns:
            combined['Date2'] = combined['Date2'].apply(lambda x: x.strftime('%m/%d/%Y') if isinstance(x, pd.Timestamp) else x)
    else:
        combined['Date'] = combined['Date'].apply(lambda x: x.strftime('%m/%d') if isinstance(x, pd.Timestamp) else x)
        if 'Date2' in combined.columns:
            combined['Date2'] = combined['Date2'].apply(lambda x: x.strftime('%m/%d') if isinstance(x, pd.Timestamp) else x)
    
    # Add Date2 column if it doesn't exist (for schedule entries that don't have date ranges)
    if 'Date2' not in combined.columns:
        combined['Date2'] = ''
    
    combined['Date'] = combined[['Date','Date2']].apply(hyphenate, axis = 1)
    
    # Return columns based on by_week setting
    if by_week:
        result = combined[['Day', 'Date', 'Description']].copy()
        result.columns = ['Week #', 'Week of', 'Description']
        return result.fillna('')
    else:
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

    # create data frame of days
    dates_list = []
    
    # Find the Monday of the first week 
    first_monday = start_date - timedelta(days=start_date.weekday())
    
    current_date = start_date
    while current_date <= end_date :
        full_day = current_date.strftime('%A')
        abbreviated_day = DAY_ABBREVIATIONS[full_day]
        
        if abbreviated_day in days :
            if by_week:
                # Calculate week number based on Monday of the start date
                days_since_first_monday = (current_date - first_monday).days
                week_number = (days_since_first_monday // 7) + 1
                dates_list.append((week_number, current_date, ''))
            else:
                # Regular day format
                if abbreviate_days:
                    display_day = abbreviated_day
                else:
                    display_day = full_day
                dates_list.append((display_day, current_date, ''))
        
        current_date += timedelta(days = 1)

    # Set headers based on if it's by week or by day
    if not by_week:
        df = pd.DataFrame(dates_list, columns = ['Day', 'Date', 'Description'])
    else:
        df = pd.DataFrame(dates_list, columns = ['Week #', 'Week of', 'Description'])
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
    
    dates_df = dates_df.map(lambda x: pd.to_datetime(x) if x != '' else x)

    # add day names (week numbers will be added later if needed)
    if abbreviate_days:
        dates_df[['Day','Day2']] = dates_df.map(lambda x: DAY_ABBREVIATIONS[x.strftime('%A')] if x != '' else x)
    else:
        dates_df[['Day','Day2']] = dates_df.map(lambda x: x.strftime('%A') if x != '' else x)

    # combine days, e.g., Monday - Wednesday
    dates_df['Day'] = dates_df[['Day','Day2']].apply(hyphenate, axis = 1)

    dates_df['Description'] = list(df['Description'])
    return dates_df.drop('Day2', axis = 1)

if __name__ == "__main__":
    term = "Fall"
    year = "2025"
    days = "TR"
    class_time = "9:30 - 10:45am"

    schedule = create_schedule(term, year, days, class_time)
    
    print("=== COMPLETE SCHEDULE WITH FINAL EXAM ===")
    print(schedule.tail(10))  # Show last 10 entries to see the final exam
