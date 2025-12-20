// Overview page.
// This page pulls data from a CSV file to dynamically load OverviewCards,
// which are displayed in a summary format for each section of the syllabus.
// The card components are defined in components/OverviewCard.
// A linker map for navigation buttons is handled in AppNavigation (not shown here).

import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import OverviewCard from "./OverviewCard";
import {loadSyllabusSections, SectionData} from "../../../utils/loadSyllabusSections";
import {isSectionComplete, getCurrentCourseData, ValidInputsResponse, fetchRequiredInputs} from "../../../services/validInputsService";
import {MOCK_VALID_INPUTS} from "../../../services/mockValidInputs";
import {loadMockCourseData, clearMockCourseData} from "../../../services/mockCourseData";
import './Overview.css'

import ModalRenderer from "../../../components/Modals/ModalRenderer";

import SyllabusGreen from "../../../assets/images/SyllabusGreen.png"
import SyllabusGrey from "../../../assets/images/SyllabusGrey.png"
import MainImage from "../../../assets/images/BookShelfBackGroundMain.png";

import { useSyllabusWrapperLogic } from "../../../hooks/useSyllabusWrapperLogic";
import SyllabusPageHeader from '../../../SyllabusLayout/SyllabusPageHeader';

// Functional component that displays the overview page.
const Overview = () => {
    // State to hold the array of section data loaded from the CSV file.
    const [sections, setSections] = useState<SectionData[]>([]);
    const [validInputs, setValidInputs] = useState<ValidInputsResponse>({});
    //const [courseData, setCourseData] = useState<Record<string, string>>({});

    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
  
    
    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage
    };
  
     
    /*******************************************************************
     * Taken from GeneratePageWrapper
     ********************************************************************/
    const navigate = useNavigate();
      const location = useLocation();
    
      // Local page state
      const [formData, setFormData] = useState<Record<string, string>>({});
      const [courseId, setCourseId] = useState<string | null>( localStorage.getItem("currentCourseId"));
      const [isLoading, setIsLoading] = useState(true);
    
      console.log('initial formData');
      console.log(formData);

      // useSyllabusWrapperLogic will load course data!
      const {
        modal,
        handleBackClick,
        handleNextClick,
        handleSave,
        handleSaveAndExit,
        handlePreviewClick,
        containerRef,
      } = useSyllabusWrapperLogic(formData, setFormData, navigate, location.pathname);


    // useEffect runs once on component mount to fetch CSV data and API data
    useEffect(() => {
        // Load sections from CSV
        console.log('loading sections..');
        loadSyllabusSections("/data/syllabus_sections.csv").then(setSections);
        
        // For testing: Use mock data instead of API call
        // When backend is available, uncomment the fetchValidInputs call below
        //console.log('Using mock valid inputs data for testing');
        //setValidInputs(MOCK_VALID_INPUTS);
        
        // Uncomment this when backend is running:
         fetchRequiredInputs().then(setValidInputs)
             .catch(error => {
                 console.error('Failed to fetch valid inputs:', error);
                 //setValidInputs({});
         });
        
        // Load current course data
        //setCourseData(getCurrentCourseData());

        //console.log('redirect modal..');
        //modal.showRedirect("Loading Data", "Fetching course information...");

    }, []);

    
    // Check if a section is complete
    const checkSectionComplete = (sectionId: string): boolean => {
        //console.log("checking section: " + sectionId);
        return isSectionComplete(sectionId, validInputs, formData);
    };
    
    /*******
    useEffect(() => {
        console.log("valid inputs -->");
        console.log(validInputs);
    }, [validInputs]);

    useEffect(() => {
        console.log('form data -->');
        console.log(formData);
    }, [formData]);

    */
   
    /****
    // Testing functions
    const handleLoadCompleteBasicInfo = () => {
        loadMockCourseData(['basic_information']);
        setCourseData(getCurrentCourseData());
    };
    
    const handleLoadCompleteBoth = () => {
        loadMockCourseData(['basic_information', 'course_description']);
        setCourseData(getCurrentCourseData());
    };
    
    const handleClearData = () => {
        clearMockCourseData();
        setCourseData({});
    };
     */

    //ShowModal
    useEffect (() =>{
        if (isLoading) {
        modal.showRedirect("Loading Data", "Fetching course information...", "loading");
    } else {
        modal.hide ()
    }
    }, [isLoading]);

    return(
        <div>            
            <SyllabusPageHeader onBack = {undefined}
                            onNext = {handleNextClick}
                            onSave = {handleSave}
                            onSaveAndExit = {handleSaveAndExit}
                            onPreview = {handlePreviewClick}
                            changesDetected = {false}            
            />             

            {/****
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreviewClick}
            />
             */}
            <div className="entirePage"
                 style = {{
                     backgroundImage: `url(${MainImage})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                     backgroundAttachment: 'fixed',
                     minHeight: '100vh',
                 }}
            >
                <div className='overview-container'>

                 
                 {/* Introduction message to help users understand the tool */}
                    <p className="overview-intro"> This course planning tool will walk you through the steps of building
                    evidence-based courses and produces a downloadable, editable syllabus in Word. The creators of this
                    tool recognize that course planning is not is not always a linear process and so you can navigate
                    through the steps in a way that works for your course planning approach.
                    You can:
                     <ul>
                           <li>Skip and come back to sections</li>
                          <li>Save over previous answers</li>
                         <li>Complete the course planning over multiple sittings.</li>
                     </ul>
                     <p>
                        The tool itself will support you in providing the content of your course syllabus, some of the
                        questions present in the tool are geared to help you build your course and do not appear in the
                        syllabus itself.</p>
                        <p>The fields that show up on your syllabus are in <span
                        className="green-text">green</span> throughout the tool</p>
                        <img src ={SyllabusGreen} alt="SyllabusGreen" className="Syllabus-green-box"/>
                        <p>The fields that are brainstorming and do not show up on your syllabus are in gray.</p>
                     <img src={SyllabusGrey} alt="SyllabusGrey" className="Syllabus-grey-box"/>
                     <p>If you would like to add images or figures to your syllabus, you should do so AFTER you have downloaded the syllabus into word.</p>
                      <p>You can store up to 15 syllabi in the course planning tool at a time.</p>
                 </p>

                 {/* Render one OverviewCard per section from the CSV */}
                    {sections.map(section => (
                        <div className="overview-card-margin" key={section.id}>
                          <OverviewCard   
                                           title={section.title}
                                           description={section.description}
                                           completed={checkSectionComplete(section.section_id)}
                                           link={section.link}
                                            imageSrc={section.imageSrc}
                          />
                        </div>
                 ))}



                <ModalRenderer modal={modal} />

                {/*
                 <RedirectingModal
                     visible={modalVisible}
                     status={modalStatus}
                        title={modalTitle}
                      message={modalMessage}
                    />
                    */}
                </div>
            </div>
        </div>
    );
};
export default Overview;


/****
 * Testing Panel 

                 <div style={{
                     background: 'rgba(255, 243, 205, 0.95)',
                     padding: '20px',
                     margin: '20px 0',
                     borderRadius: '8px',
                     border: '2px solid #ffc107'
                 }}>
                     <h3 style={{ marginTop: 0, color: '#856404' }}>🧪 Testing Panel (Remove this in production)</h3>
                     <p style={{ color: '#856404', marginBottom: '15px' }}>
                         Test the section completeness checking feature by loading mock data:
                     </p>
                     <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                         <button 
                             onClick={handleLoadCompleteBasicInfo}
                             style={{
                                 padding: '10px 20px',
                                 backgroundColor: '#28a745',
                                 color: 'white',
                                 border: 'none',
                                 borderRadius: '4px',
                                 cursor: 'pointer'
                             }}
                         >
                             ✅ Load Complete Basic Info
                         </button>
                         <button 
                             onClick={handleLoadCompleteBoth}
                             style={{
                                 padding: '10px 20px',
                                 backgroundColor: '#007bff',
                                 color: 'white',
                                 border: 'none',
                                 borderRadius: '4px',
                                 cursor: 'pointer'
                             }}
                         >
                             ✅✅ Load Both Sections Complete
                         </button>
                         <button 
                             onClick={handleClearData}
                             style={{
                                 padding: '10px 20px',
                                 backgroundColor: '#dc3545',
                                 color: 'white',
                                 border: 'none',
                                 borderRadius: '4px',
                                 cursor: 'pointer'
                             }}
                         >
                             🗑️ Clear All Data
                         </button>
                     </div>
                     <p style={{ color: '#856404', marginTop: '15px', fontSize: '14px' }}>
                         Click a button above, then watch the checkboxes update below!
                     </p>
                 </div>

  
  
 
 */