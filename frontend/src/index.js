//CSS FONTS IMPORT
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Import your core components
import CheckboxGroup from './components/CheckboxGroup';
import Alert from './components/Alert';
import Information from './components/Information';

function ComponentShowcase() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Component Showcase</h1>
      
      <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #ddd', borderRadius: '8px' }}>
        <h2>CheckboxGroup Component</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Horizontal Layout (Default Days)</h3>
          <CheckboxGroup 
            id="horizontal_days"
            horizontal={true}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Vertical Layout (Default Days)</h3>
          <CheckboxGroup 
            id="vertical_days"
            horizontal={false}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Horizontal with Check All</h3>
          <CheckboxGroup 
            id="horizontal_with_all"
            data={["Check All", "M", "T", "W", "R", "F"]}
            horizontal={true}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Custom Options (Vertical)</h3>
          <CheckboxGroup 
            id="custom_options"
            data={["Option A", "Option B", "Option C", "Option D"]}
            horizontal={false}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Full Week (Horizontal)</h3>
          <CheckboxGroup 
            id="full_week"
            data={["Check All", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            horizontal={true}
          />
        </div>
      </section>

      <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #ddd', borderRadius: '8px' }}>
        <h2>Alert Component</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <Alert text="The ELAC curriculum has five already-articulated learning competencies in Communication, Creativity, Critical Thinking, Ethical Reasoning, Quantitative Literacy (they are articulated below and can be found in SB 19-20_07. At least TWO of these competencies must be included in your ELAC Seminar or Disciplinary Perspectives Course Syllabus. You should convert these competencies into no more than 5-10 course level learning outcomes using the following guidance. You will want to consult the rubrics which are included in SB 19-20_07." />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Alert text="The ELAC requires that you implement at least two High Impact Practices into your ELAC seminar course or one High Impact Practice into your ELAC disciplinary perspectives course." />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Alert text="Alert messages now feature a stacked card design with Font Awesome octagon icon." />
        </div>
      </section>

      <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #ddd', borderRadius: '8px' }}>
        <h2>Information Component</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <Information text="This is a standard information message." />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Information text="Information entered on this page will appear in the final syllabus exactly as written. This is an example of a longer informational message." />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Information text="ℹ️ Pro tip: You can include helpful hints and guidance here!" />
        </div>
      </section>

      <section style={{ padding: '1.5rem', border: '2px solid #007acc', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <h2>Usage Examples</h2>
        <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'monospace' }}>
          <p><strong>CheckboxGroup:</strong></p>
          <pre>{`<CheckboxGroup 
  id="my_checkboxes"
  data={["Option 1", "Option 2", "Option 3"]}
  horizontal={true} // or false for vertical
/>`}</pre>
          
          <p><strong>Alert:</strong></p>
          <pre>{`<Alert text="Your alert message here" />`}</pre>
          
          <p><strong>Information:</strong></p>
          <pre>{`<Information text="Your info message here" />`}</pre>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ComponentShowcase />
    </React.StrictMode>
);

reportWebVitals();
