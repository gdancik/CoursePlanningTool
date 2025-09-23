import React from 'react';
import { createRoot } from 'react-dom/client';

// Import all your test components
import CheckboxGroupTest from './components/screens/CheckboxGroupTest';
import InformationTest from './components/screens/InformationTest';
import Alert from './components/SyllabusComponents/Alert';
import AlertB from './components/SyllabusComponents/AlertB';
import InformationB from './components/SyllabusComponents/InformationB';

// Simple, testable checkbox group
function CheckboxGroup({
  id = "meeting_days_checkboxes",
  data = ["M", "T", "W", "R", "F"],
  horizontal = true,
}) {
  return (
    <div
      id={id}
      role="group"
      aria-label="Meeting days"
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        gap: '0.5rem',
        margin: '1rem 0',
      }}
    >
      {data.map((d) => (
        <label
          key={d}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <input type="checkbox" value={d} />
          {d}
        </label>
      ))}
    </div>
  );
}

// Test page definitions
const TEST_PAGES = {
  myComponents: () => (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>My Components Test Page</h1>
      
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>CheckboxGroup Component</h2>
        <CheckboxGroup />
        <CheckboxGroup horizontal={false} />
        <CheckboxGroup data={["Option 1", "Option 2", "Option 3"]} />
      </section>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>CheckboxGroupTest Component</h2>
        <CheckboxGroupTest />
      </section>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>InformationTest Component</h2>
        <InformationTest />
      </section>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>Alert Components</h2>
        <Alert text="This is an alert message." />
        <AlertB text="This is an AlertB message." />
        <InformationB text="This is an informational message." />
      </section>
    </div>
  ),

  checkboxes: () => (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Checkbox Components Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Default Horizontal</h2>
        <CheckboxGroup />
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Vertical Layout</h2>
        <CheckboxGroup horizontal={false} />
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Custom Data</h2>
        <CheckboxGroup data={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]} />
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>CheckboxGroupTest Component</h2>
        <CheckboxGroupTest />
      </div>
    </div>
  ),

  alerts: () => (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Alert & Information Components Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Alert Component</h2>
        <Alert text="This is a standard alert message." />
        <Alert text="This is a longer alert message to test how the component handles extended text content and whether it maintains proper styling and readability." />
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>AlertB Component</h2>
        <AlertB text="This is a standard AlertB message." />
        <AlertB text="This is a longer AlertB message to test how the component handles extended text content and whether it maintains proper styling and readability." />
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Information Component</h2>
        <InformationB text="This is a standard information message." />
        <InformationB text="This is a longer information message to test how the component handles extended text content and whether it maintains proper styling and readability." />
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Information Test Component</h2>
        <InformationTest />
      </div>
    </div>
  ),

  all: () => (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>All Components Test Page</h1>
      
      <nav style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h3>Available Test Pages:</h3>
        <ul>
          <li><code>npm run test:myComponents</code> - Main components overview</li>
          <li><code>npm run test:checkboxes</code> - Checkbox components</li>
          <li><code>npm run test:alerts</code> - Alert and information components</li>
          <li><code>npm run test:all</code> - All components (this page)</li>
        </ul>
      </nav>
      
      {/* Render all test pages */}
      {Object.entries(TEST_PAGES).filter(([key]) => key !== 'all').map(([key, Component]) => (
        <div key={key} style={{ marginBottom: '3rem', border: '2px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
          <h2 style={{ color: '#007acc', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
            {key.charAt(0).toUpperCase() + key.slice(1)} Test Page
          </h2>
          <Component />
        </div>
      ))}
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
  
  // Default to 'all'
  return 'all';
}

function TestPageRunner() {
  const pageName = getTestPage();
  const PageComponent = TEST_PAGES[pageName] || TEST_PAGES.all;
  
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

// Only render if this is the main entry point
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const root = createRoot(document.getElementById('root'));
  root.render(<TestPageRunner />);
}

export default TestPageRunner;
export { CheckboxGroup, TEST_PAGES };