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
