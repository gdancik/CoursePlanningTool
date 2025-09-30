import React from 'react';

// Import components directly
import CheckboxGroup from './components/SyllabusComponents/CheckboxGroup';
import Alert from './components/SyllabusComponents/Alert';
import Information from './components/SyllabusComponents/Information';
import SidebarLayout, { SidebarLink } from './components/SidebarLayout';

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
        <Alert text="If your course is not in the ELAC curriculum, you may still want to use ELAC competencies, here are some additional competencies that you may want to incorporate into your course may fall into the following categories: knowledge, skills, or attitudes." />
        <Alert text="The ELAC requires that you implement at least two High Impact Practices into your ELAC seminar course or one High Impact Practice into your ELAC disciplinary perspectives course." />
      </section>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>Information Component</h2>
        <Information text="Information entered on this page will appear in the final syllabus exactly as written." />
        <Information text="This component provides helpful guidance and instructions to users." />
      </section>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>SidebarLayout Component</h2>
        
        <h3>Example 1: High Impact Practices (matching your image)</h3>
        <SidebarLayout
          sidebarTitle="Definition of High Impact Practices"
          sidebarContent="High impact practices are teaching interventions and approaches that have been demonstrated to improve student learning and engagement. Implementing high impact practices in your classrooms requires significant planning and a consideration of the resources you have available, the size of your course, the placement of your course within the curriculum (either your program or ELAC). Courses in Eastern's ELAC curriculum require high impact practices, if your course is not in the ELAC curriculum but is conducive to supporting the implementation of a high impact practice, the following information should help get you started.

The table below includes a list of High Impact Practices, your discipline may have identified additional high impact practices (must be supported by scholarship on teaching and learning). You may include additional high impact practices in your courses if you can provide evidence that they are a high impact practice within your field."
        >
          <div>
            <p>
              <SidebarLink href="https://www.easternct.edu/ctla/">
                Link to CTLA ↗
              </SidebarLink>
            </p>
            <p>This is where the main content would go - forms, tables, additional information, etc.</p>
            <p>You can put any React component or content here.</p>
          </div>
        </SidebarLayout>

        {/* <h3>Example 2: Competencies (matching second image)</h3>
        <SidebarLayout
          sidebarTitle="Identify the purpose and application of the competencies."
          sidebarContent="The table on the next page provides an example of how to start identifying the purpose and application of the competencies you have identified as important to your course. This process prepares you to write clear learning outcomes and help students make the connection between course expectations, activities, and the competencies that they seek to develop."
        >
          <div>
            <p>
              <SidebarLink onClick={() => alert('Navigate to Purpose and Application Examples')}>
                Purpose and Application Examples ↗
              </SidebarLink>
            </p>
            <p>This would contain the competencies table or form content.</p>
          </div>
        </SidebarLayout> */}

        {/* <h3>Example 3: With Different Styling</h3>
        <SidebarLayout
          sidebarTitle="Communicating with Students"
          sidebarContent="Clear communication expectations and channels help create a positive learning environment."
          backgroundColor="#e8f4fd"
          borderColor="#3182ce"
          sidebarWidth="250px"
        >
          <Alert text="Remember to check your email regularly and respond to student inquiries within 24-48 hours." />
          <Information text="Consider using announcement tools in your LMS to communicate important updates." />
        </SidebarLayout> */}
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