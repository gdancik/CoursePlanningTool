import sys
import os

# Add the parent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Add the backend directory to the Python path -- required for local imports in module 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/')))

import pytest
import backend.syllabus_fetcher as sf
from docx import Document
import re

def test_get_webpage():
    url = "http://example.com" 
    soup = sf.get_webpage(url)

    assert soup.title is not None
    assert "Example Domain" in soup.title.string

def test_getStatements():
    url = 'https://www.easternct.edu/center-for-teaching-learning-and-assessment/course-design-resources/syllabus-statements.html'

    statements_dict = sf.getStatements(url,['Diversity Statement']) 

    statement_keys = list(statements_dict.keys())
    statement_values = list(statements_dict.values())
    expected_diversity_statement = '''Eastern Connecticut State University values the diversity of its students, faculty, and staff. Differences in race, ethnicity, national origin, class, religion, learning styles, gender, gender identity and expression, sexual orientation, age, ideology, and other aspects of human variation and characterization, including but not limited to those protected by law and CSCU policies, enrich the educational experiences and social and intellectual development of students and create a rich cultural environment. Eastern is committed to ensuring that regardless of their differences, all members of the Eastern community are challenged to achieve their full potential and are supported in their pursuit of that goal in a campus environment that is free from discrimination and harassment.'''
    
    assert re.search('Diversity Statement',str(statement_keys[0])) is not None
    assert re.search(expected_diversity_statement.strip(),str(statement_values[0])) is not None

# def test_create_syllabus_statment_page():
#     pass

# def test_html_to_word_htmldocx():
#     pass

#%%
if __name__ == '__main__':
    test_getStatements()