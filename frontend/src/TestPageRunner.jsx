import React from 'react';

// Import components directly
import CheckboxGroup from './components/SyllabusComponents/CheckboxGroup';
import Alert from './components/SyllabusComponents/Alert';
import Information from './components/SyllabusComponents/Information';
import SidebarLayout, { SidebarLink } from './components/SidebarLayout';
import ContentCard from './components/SyllabusComponents/ContentCard';
import ContentCardSet from './components/SyllabusComponents/ContentCardSet';

// ContentCard Demo Component
const ContentCardDemo = () => {
  const [singleCardData, setSingleCardData] = React.useState({
    title: "Sample Assignment Title",
    description: "This is a detailed description of the assignment. Students will need to complete research, write a paper, and present their findings to the class.",
    rightValue: "25"
  });

  const [cardSetData, setCardSetData] = React.useState([
    {
      id: '1',
      title: "Learning Outcome 1",
      description: "Students will demonstrate understanding of key concepts in the subject matter.",
      rightValue: ""
    },
    {
      id: '2', 
      title: "Learning Outcome 2",
      description: "Students will apply critical thinking skills to analyze complex problems.",
      rightValue: ""
    }
  ]);

  const [assignmentData, setAssignmentData] = React.useState([
    {
      id: '1',
      title: "Research Paper",
      description: "A comprehensive research paper on a topic of your choice within the course subject matter.",
      rightValue: "30"
    },
    {
      id: '2',
      title: "Final Exam",
      description: "Comprehensive final examination covering all course materials.",
      rightValue: "40"
    }
  ]);

  return (
    <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h2>ContentCard Components</h2>
      
      {/* Single ContentCard Example */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Single ContentCard Example</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>
          A standalone ContentCard with title, description, and optional right-value field
        </p>
        <ContentCard
          titleLabel="Assignment Title:"
          titleValue={singleCardData.title}
          descriptionLabel="Assignment Description:"
          descriptionValue={singleCardData.description}
          rightLabel="Points:"
          rightValue={singleCardData.rightValue}
          onTitleChange={(value) => setSingleCardData(prev => ({ ...prev, title: value }))}
          onDescriptionChange={(value) => setSingleCardData(prev => ({ ...prev, description: value }))}
          onRightValueChange={(value) => setSingleCardData(prev => ({ ...prev, rightValue: value }))}
        />
      </div>

      {/* ContentCardSet for Learning Outcomes */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>ContentCardSet - Learning Outcomes</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>
          A set of ContentCards for managing learning outcomes (without right-value field)
        </p>
        <ContentCardSet
          setTitle="Learning Outcomes"
          titleLabel="Learning Outcome {index} Title:"
          descriptionLabel="Learning Outcome {index} Description:"
          initialCards={cardSetData}
          onChange={setCardSetData}
          minCards={2}
          maxCards={8}
          showRightValue={false}
        />
      </div>

      {/* ContentCardSet for Assignments */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>ContentCardSet - Assignments with Points</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>
          A set of ContentCards for managing assignments with point values
        </p>
        <ContentCardSet
          setTitle="Assignments"
          titleLabel="Assignment {index} Title:"
          descriptionLabel="Assignment {index} Description:"
          rightLabel="Points:"
          initialCards={assignmentData}
          onChange={setAssignmentData}
          maxCards={10}
          showRightValue={true}
        />
      </div>

      {/* Feature Overview */}
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
        <h3>ContentCard Features</h3>
        <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
          <li><strong>Editable Fields:</strong> Title and description with real-time updates</li>
          <li><strong>Optional Right Value:</strong> For points, percentages, or other numerical data</li>
          <li><strong>Word Count Display:</strong> Shows character count for descriptions (max 500)</li>
          <li><strong>ELAC Theme:</strong> Consistent green styling (#28a745) throughout</li>
          <li><strong>Dynamic Management:</strong> Add/delete cards with configurable min/max limits</li>
          <li><strong>Label Templates:</strong> Use {`{index}`} placeholder for dynamic numbering</li>
          <li><strong>localStorage Integration:</strong> Automatic data persistence</li>
          <li><strong>JSDoc Documentation:</strong> Full TypeScript documentation for all props</li>
        </ul>
      </div>

      {/* Usage Examples */}
      <div style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <h3>Usage Examples</h3>
        <pre style={{ fontSize: '12px', lineHeight: '1.4', overflow: 'auto' }}>
{`// Basic ContentCard
<ContentCard
  titleLabel="Title:"
  titleValue={title}
  descriptionLabel="Description:"
  descriptionValue={description}
  onTitleChange={setTitle}
  onDescriptionChange={setDescription}
/>

// ContentCard with right value
<ContentCard
  titleLabel="Assignment:"
  descriptionLabel="Description:"
  rightLabel="Points:"
  rightValue={points}
  showRightValue={true}
  onRightValueChange={setPoints}
/>

// ContentCardSet for multiple items
<ContentCardSet
  setTitle="Learning Outcomes"
  titleLabel="Learning Outcome {index} Title:"
  descriptionLabel="Learning Outcome {index} Description:"
  initialCards={cards}
  onChange={setCards}
  minCards={2}
  maxCards={8}
/>`}
        </pre>
      </div>
    </section>
  );
};

// Test page definitions
const TEST_PAGES = {
  components: () => (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Component Test Page</h1>
      
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>CheckboxGroup Component</h2>
        <div style={{ marginBottom: '1rem' }}>
          <h3>Horizontal with "Check All" and Label</h3>
          <CheckboxGroup 
            label="Meeting Days"
            id="meeting_days_checkboxes"
            data={["Check All", "M", "T", "W", "R", "F"]}
            horizontal={true}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h3>Vertical Layout with Label</h3>
          <CheckboxGroup 
            label="Assessment Types"
            id="vertical_days_checkboxes"
            data={["Quizzes", "Exams", "Projects", "Presentations"]}
            horizontal={false}
          />
        </div>
        <div>
          <h3>Without Label (Original Style)</h3>
          <CheckboxGroup 
            id="no_label_checkboxes"
            data={["M", "T", "W", "R", "F"]}
            horizontal={true}
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
        
        <h3>This is the SidebarLayout Component</h3>
        <SidebarLayout
          sidebarTitle="This is the title of the sidebar"
          sidebarContent="lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          >
          <div>
            <p>
              <SidebarLink href="https://www.easternct.edu/ctla/">
                Link to CTLA ↗
              </SidebarLink>
            </p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore nobis, nemo corrupti laborum adipisci eaque iure quo, assumenda excepturi esse dolores inventore dolor debitis, ea laboriosam. Quae deserunt voluptatum, rerum velit, voluptates laudantium cupiditate dolorem similique fugit odio ex exercitationem! Neque repellat iste at, exercitationem ducimus harum, cum non quidem veniam facere accusamus ab cumque atque culpa doloribus iure, fugit esse nihil. Illum cumque vel quibusdam corporis sed eaque rem cupiditate? Tenetur eos dolore a vero culpa quia sapiente saepe quis possimus ex placeat ad cumque voluptates, omnis asperiores perferendis labore qui veniam aperiam. Ipsa, aspernatur? Laborum quaerat et odio?</p>
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

      <ContentCardDemo />
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