import sys
import os

# Add the parent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import backend.course_calendar as cc
from datetime import datetime

def testFall() :
    url = 'https://www.easternct.edu/academics/academic-calendar/index.html'
    today = datetime.today()
    target = 'Fall ' + str(today.year)

    soup = cc.get_target_webpage(url, target)
    df = cc.get_dates(soup, target)

def testSpring() :
    url = 'https://www.easternct.edu/academics/academic-calendar/index.html'
    today = datetime.today()
    target = 'Spring ' + str(today.year)

    soup = cc.get_target_webpage(url, target)
    df = cc.get_dates(soup, target)

def testInvalidYear() :
    try: 
        url = 'https://www.easternct.edu/academics/academic-calendar/index.html'
        target = 'FAIL 2025'

        soup = cc.get_target_webpage(url, target)
        df = cc.get_dates(soup, target)
    except Exception as err :
        print(err)
        assert str(err) == 'Term FAIL 2025 not found in current or upcoming urls'

def testGenerateSchedule() :
    start_date = datetime.strptime('08/02/2014', "%m/%d/%Y").date()
    end_date = datetime.strptime('08/10/2014', "%m/%d/%Y").date()

    # we should have 3 MWF days 
    df = cc.generate_schedule(start_date, end_date, 'MWF')

    assert list(df['Day']) == ['Monday', 'Wednesday', 'Friday']
    assert list(df['Date']) == ['08/04/2014', '08/06/2014', '08/08/2014']

    # we should only have 1 Tuesday
    df = cc.generate_schedule(start_date, end_date, 'T')
    assert df.shape[0] == 1

    # we should get an error if start_date > end_date
    try :
        df = cc.generate_schedule(end_date, start_date, 'T')
    except Exception as err :
        assert str(err) == 'Start date 2014-08-10 must come before end date 2014-08-02'

