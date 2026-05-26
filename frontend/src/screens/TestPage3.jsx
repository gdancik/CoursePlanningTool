import React from 'react';

// Import components directly
import CheckboxGroup from '../components/SyllabusComponents/CheckboxGroup';
import Alert from '../components/SyllabusComponents/Alert';
import Information from '../components/SyllabusComponents/Information';

// Test page definitions
const TEST_PAGES = {
  components: () => (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Component Test Page</h1>
      
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>CheckboxGroup Component</h2>
        <div style={{ marginBottom: '1rem' }}>
          <h3>Horizontal with "Check All"</h3>
          <CheckboxGroup 
            id="meeting_days_checkboxes"
            data={["Check All", "M", "T", "W", "R", "F"]}
            horizontal={true}
          />
        </div>
        <div>
          <h3>Vertical Layout</h3>
          <CheckboxGroup 
            id="vertical_days_checkboxes"
            data={["M", "T", "W", "R", "F"]}
            horizontal={false}
          />
        </div>
      </section>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>Alert Component</h2>
        <Alert text="If your course is not in the ELAC curriculum, you may still want to use ELAC competencies. In addition, you may want to incorporate knowledge, skills, or attitudes as additional competencies in your course." />
        <Alert text="If you are teaching an ELAC course, you are required to implement at least two High Impact Practices into your ELAC seminar course or one High Impact Practice into your ELAC disciplinary perspectives course." />
      </section>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>Information Component</h2>
        <Information text="Information entered on this page will appear in the final syllabus exactly as written." />
        <Information text="This component provides helpful guidance and instructions to users." />
      </section>
    </div>
  ),
};

// Get the test page from environment variable or URL parameter
function getTestPage() {
  // Check environment variable first
  const envPage = process.env.REACT_APP_TEST_PAGE;
  if (envPage && TEST_PAGES[envPage]) {
    return envPage;
  }
  
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlPage = urlParams.get('page');
  if (urlPage && TEST_PAGES[urlPage]) {
    return urlPage;
  }
  
  // Default to 'components'
  return 'components';
}

function TestPageRunner() {
  const pageName = getTestPage();
  const PageComponent = TEST_PAGES[pageName] || TEST_PAGES.components;
  
  return (
    <div>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        padding: '0.5rem', 
        backgroundColor: '#007acc', 
        color: 'white', 
        fontSize: '0.8rem',
        zIndex: 1000
      }}>
        Testing: {pageName}
      </div>
      <PageComponent />
    </div>
  );
}

export default TestPageRunner;
