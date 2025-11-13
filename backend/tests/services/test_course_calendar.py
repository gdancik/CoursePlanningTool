import sys
import os
from datetime import datetime

# Add the greatgrandparent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

import backend.services.course_calendar as cc

def testFall() :
    url = 'https://www.easternct.edu/academics/academic-calendar/index.html'
    today = datetime.today()
    target = 'Fall ' + str(today.year)

    soup = cc.get_target_webpage(url, target)
    df = cc.get_dates(soup, target)
    cc.process_academic_calendar(df,'Fall 2025', '2025')

def testSpring2026() :
    url = 'https://www.easternct.edu/academics/academic-calendar/index.html'    
    target = 'Spring 2026'

    soup = cc.get_target_webpage(url, target)
    df = cc.get_dates(soup, target)

def testInvalidYear() :
    try: 
        url = 'https://www.easternct.edu/academics/academic-calendar/index.html'
        target = 'FFFF 2025'

        soup = cc.get_target_webpage(url, target)
        df = cc.get_dates(soup, target)
    except Exception as err :
        print(err)
        assert str(err) == 'Calendar for FFFF 2025 not found'

def testGenerateSchedule() :
    start_date = datetime.strptime('08/02/2014', "%m/%d/%Y").date()
    end_date = datetime.strptime('08/10/2014', "%m/%d/%Y").date()

    # we should have 3 MWF days 
    df = cc.generate_schedule(start_date, end_date, 'MWF')

    assert list(df['Day']) == ['Monday', 'Wednesday', 'Friday']
   
    assert(list(df['Date']) == 
       [datetime.date(datetime(2014, 8, 4)),
        datetime.date(datetime(2014, 8, 6)),
        datetime.date(datetime(2014, 8, 8))
    ])

    # we should only have 1 Tuesday
    df = cc.generate_schedule(start_date, end_date, 'T')
    assert df.shape[0] == 1

    # we should get an error if start_date > end_date
    try :
        df = cc.generate_schedule(end_date, start_date, 'T')
    except Exception as err :
        assert str(err) == 'Start date 2014-08-10 must come before end date 2014-08-02'

def testCreateSchedule():
    cc.create_schedule('Fall','2025','MWF','https://www.easternct.edu/academics/academic-calendar/index.html')

