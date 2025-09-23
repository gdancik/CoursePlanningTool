import React from 'react';
import { createRoot } from 'react-dom/client';

// Import your components
import CheckboxGroupTest from './screens/CheckboxGroupTest';
import InformationTest from './screens/InformationTest';
import AlertB from './components/Alert';
import InformationB from './components/InformationB';

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

// Component test runner
function ComponentTestRunner() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <style>{`
        .test-section {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .test-section h2 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #007acc;
          padding-bottom: 5px;
        }
        .test-variant {
          margin: 10px 0;
          padding: 10px;
          background-color: white;
          border-radius: 4px;
          border-left: 3px solid #007acc;
        }
        .test-variant h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }
      `}</style>
      
      <h1 style={{ color: '#333', textAlign: 'center' }}>Component Test Runner</h1>
      
      <div className="test-section">
        <h2>CheckboxGroup Variations</h2>
        
        <div className="test-variant">
          <h3>Default (Horizontal)</h3>
          <CheckboxGroup />
        </div>
        
        <div className="test-variant">
          <h3>Vertical Layout</h3>
          <CheckboxGroup horizontal={false} />
        </div>
        
        <div className="test-variant">
          <h3>Custom Data</h3>
          <CheckboxGroup data={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]} />
        </div>
        
        <div className="test-variant">
          <h3>Custom ID</h3>
          <CheckboxGroup id="custom-checkbox-group" data={["Option A", "Option B"]} />
        </div>
      </div>

      <div className="test-section">
        <h2>CheckboxGroupTest Component</h2>
        <div className="test-variant">
          <CheckboxGroupTest />
        </div>
      </div>

      <div className="test-section">
        <h2>InformationTest Component</h2>
        <div className="test-variant">
          <InformationTest />
        </div>
      </div>

      <div className="test-section">
        <h2>Alert & Information Components</h2>
        
        <div className="test-variant">
          <h3>AlertB</h3>
          <AlertB text="This is an alert message." />
        </div>
        
        <div className="test-variant">
          <h3>InformationB</h3>
          <InformationB text="This is an informational message." />
        </div>
        
        <div className="test-variant">
          <h3>Long Text Test</h3>
          <AlertB text="This is a much longer alert message to test how the component handles longer text content and whether it wraps properly or maintains its styling." />
          <br />
          <InformationB text="This is a much longer informational message to test how the component handles longer text content and whether it wraps properly or maintains its styling." />
        </div>
      </div>
    </div>
  );
}

// Only render if this file is being run directly
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const root = createRoot(document.getElementById('root'));
  root.render(<ComponentTestRunner />);
}

export default ComponentTestRunner;
export { CheckboxGroup };