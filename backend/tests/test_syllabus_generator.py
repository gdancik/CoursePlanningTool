import sys
import os

# Add the parent directory to the Python path -- required for direct testing of this file
#sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Add the backend directory to the Python path -- required for local imports in module 
#sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/')))

import pytest
import backend.services.syllabus_generator as sf
from docx import Document

syllabus_webpage = 'https://www.easternct.edu/center-for-teaching-learning-and-assessment/syllabus-statements/index.html'
def test_get_webpage():
    url = "http://example.com" 
    soup = sf.get_webpage(url)

    assert soup.title is not None
    assert "Example Domain" in soup.title.string

def test_getStatements():
   
    statements_dict = sf.getStatements(syllabus_webpage,['Diversity Statement']) 

    statement_keys = list(statements_dict.keys())
    statement_values = list(statements_dict.values())
    expected_diversity_statement = '''Eastern Connecticut State University values the diversity of its students, faculty, and staff. Differences in race, ethnicity, national origin, class, religion, learning styles, gender, gender identity and expression, sexual orientation, age, ideology, and other aspects of human variation and characterization, including but not limited to those protected by law and CSCU policies, enrich the educational experiences and social and intellectual development of students and create a rich cultural environment. Eastern is committed to ensuring that regardless of their differences, all members of the Eastern community are challenged to achieve their full potential and are supported in their pursuit of that goal in a campus environment that is free from discrimination and harassment.'''
    
    assert 'Diversity Statement' in str(statement_keys[0])
    assert expected_diversity_statement.strip() in str(statement_values[0])

def test_create_syllabus_statment_page():
    doc= Document()
    selected_statements= ['Academic Success Center']
    
    sf.create_syllabus_statment_page(doc,syllabus_webpage,selected_statements)
    expected_text = 'The Academic Success Center (ASC) is located on the ground floor of the library and assists Eastern students in realizing their highest level of achievement possible. We encourage all students to take advantage of the many resources offered through the following ASC offices: Advising Center, Global Learning, Opportunity Programs, Career Services, Writing Center, Math Achievement Center, and Tutoring & Learning Strategies. (Rev. 7/24)' 
    paragraphs = []
    for paragraph in doc.paragraphs:
        paragraphs.append(paragraph.text)
    assert 'Academic Success Center (ASC)' in paragraphs[0]
    assert expected_text in paragraphs[1]

