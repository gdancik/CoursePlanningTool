import React from "react";
import CheckboxGroupTest from "./screens/CheckboxGroupTest";
import InformationTest from "./screens/InformationTest";
import AlertB from "./components/Alert";
import InformationB from "./components/InformationB";

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

function TestPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Component Testing Page</h1>
      
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>CheckboxGroup Component</h2>
        <CheckboxGroup />
        
        <h3>Vertical Layout</h3>
        <CheckboxGroup horizontal={false} />
        
        <h3>Custom Data</h3>
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
        <AlertB text="This is an alert message." />
        <InformationB text="This is an informational message." />
      </section>
    </div>
  );
}

export default TestPage;