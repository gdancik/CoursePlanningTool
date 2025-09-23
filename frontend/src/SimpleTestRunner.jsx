import React from 'react';
import { createRoot } from 'react-dom/client';

// Simple test component to check if React is working
function SimpleTest() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Test - React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <button onClick={() => alert('Click works!')}>Test Click</button>
    </div>
  );
}

// Get the test page from environment variable or URL parameter
function getTestPage() {
  // Check environment variable first
  const envPage = process.env.REACT_APP_TEST_PAGE;
  console.log('Environment test page:', envPage);
  
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlPage = urlParams.get('page');
  console.log('URL test page:', urlPage);
  
  return 'simple';
}

function SimpleTestRunner() {
  const pageName = getTestPage();
  console.log('Running test page:', pageName);
  
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
      <SimpleTest />
    </div>
  );
}

// Only render if this is the main entry point
if (typeof window !== 'undefined' && document.getElementById('root')) {
  console.log('SimpleTestRunner starting...');
  const root = createRoot(document.getElementById('root'));
  root.render(<SimpleTestRunner />);
}

export default SimpleTestRunner;