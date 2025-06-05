import sys
import os

# Add the parent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Add the backend directory to the Python path -- required for local imports in module 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/')))

import pytest
import backend.doc_editor as de
from docx import Document

doc = '(Test)Doc1.docx'

def test_replaceTextInParagraph():
    test_dict ={
        '<<Name>>': 'Fetty',
        '<<Age>>': '30',
        '<<Hobby>>': 'cooking'
                }
    de.replaceTextInParagraph(doc,test_dict,'(Test)Doc1_modified.docx')
    modified_doc = Document('(Test)Doc1_modified.docx')
    para = ""
    for paragraph in modified_doc.paragraphs:
        text = paragraph.text.strip()
        if text:
            para += text + "\n"
    assert para == 'Hello my name is Fetty, I am 30 years old.\nMy favorite hobby is cooking.\n'
    

def test_printParagraphs(capsys):
    
    de.printParagraphs(doc)
    captured = capsys.readouterr()
    assert captured.out == 'Hello my name is <<Name>>, I am <<Age>> years old.\nMy favorite hobby is <<Hobby>>.\n'

def test_getParagraph():
    para = de.getParagraph(doc, 0)
    para = para.strip()
    assert para == 'Hello my name is <<Name>>, I am <<Age>> years old.'


def test_printTables(capsys):
    de.printTables(doc)
    captured = capsys.readouterr()
    x = '''
+----+-----+-------+------+
|    | 0   | 1     | 2    |
+====+=====+=======+======+
|  0 | Hi  | this  | is   |
+----+-----+-------+------+
|  1 | my  | table | that |
+----+-----+-------+------+
|  2 | I   | test  | with |
+----+-----+-------+------+
        '''
    assert captured.out.strip() == x.strip()
def test_getTable():
    pass