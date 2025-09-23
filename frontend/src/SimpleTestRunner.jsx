// import React from 'react';
// import { createRoot } from 'react-dom/client';

// // Import components directly
// import CheckboxGroup from './components/SyllabusComponents/CheckboxGroup';
// import Alert from './components/SyllabusComponents/Alert';
// import Information from './components/SyllabusComponents/Information';

// // Clean component showcase without any wrappers
// function ComponentShowcase() {
//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Inter, Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
//       <h1 style={{ color: '#333', borderBottom: '2px solid #007acc', paddingBottom: '1rem' }}>
//         Component Showcase
//       </h1>
      
//       {/* CheckboxGroup Examples */}
//       <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
//         <h2 style={{ color: '#007acc', marginBottom: '1rem' }}>CheckboxGroup Component</h2>
        
//         <div style={{ marginBottom: '2rem' }}>
//           <h3>Meeting Days with "Check All"</h3>
//           <CheckboxGroup 
//             id="meeting_days_checkboxes"
//             data={["Check All", "M", "T", "W", "R", "F"]}
//             horizontal={true}
//           />
//         </div>
        
//         <div style={{ marginBottom: '2rem' }}>
//           <h3>Vertical Layout</h3>
//           <CheckboxGroup 
//             id="vertical_days_checkboxes"
//             data={["M", "T", "W", "R", "F"]}
//             horizontal={false}
//           />
//         </div>
        
//         <div style={{ marginBottom: '1rem' }}>
//           <h3>Custom Options Horizontal</h3>
//           <CheckboxGroup 
//             id="custom_options_checkboxes"
//             data={["Check All", "Option A", "Option B", "Option C"]}
//             horizontal={true}
//           />
//         </div>
//       </section>

//       {/* Information Component Examples */}
//       <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
//         <h2 style={{ color: '#007acc', marginBottom: '1rem' }}>Information Component</h2>
//         <Information text="Information entered on this page will appear in the final syllabus exactly as written." />
//         <Information text="This component uses FontAwesome icons and has a clean, professional appearance." />
//       </section>

//       {/* Alert Component Examples */}
//       <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '2px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
//         <h2 style={{ color: '#007acc', marginBottom: '1rem' }}>Alert Component</h2>
//         <Alert text="This is an alert message that can be used to display important information." />
//         <Alert text="Alerts help draw attention to critical information that users need to see." />
//       </section>
//     </div>
//   );
// }

// function SimpleTestRunner() {
//   return (
//     <div>
//       <div style={{ 
//         position: 'fixed', 
//         top: 0, 
//         right: 0, 
//         padding: '0.5rem', 
//         backgroundColor: '#007acc', 
//         color: 'white', 
//         fontSize: '0.8rem',
//         zIndex: 1000
//       }}>
//         Direct Components
//       </div>
//       <ComponentShowcase />
//     </div>
//   );
// }

// // Only render if this is the main entry point
// if (typeof window !== 'undefined' && document.getElementById('root')) {
//   console.log('SimpleTestRunner starting...');
//   const root = createRoot(document.getElementById('root'));
//   root.render(<SimpleTestRunner />);
// }

// export default SimpleTestRunner;