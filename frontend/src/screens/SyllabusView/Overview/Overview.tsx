// Overview page.
// This page pulls data from a CSV file to dynamically load OverviewCards,
// which are displayed in a summary format for each section of the syllabus.
// The card components are defined in components/OverviewCard.
// A linker map for navigation buttons is handled in AppNavigation (not shown here).

import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import OverviewCard from "./OverviewCard";
import {loadSyllabusSections, SectionData} from "../../../utils/loadSyllabusSections";
import AppLayout from "../../../SyllabusLayout/SyllabusPageHeader"
import RedirectingModal from "../../../components/RedirectingModal/RedirectingModal";
import './Overview.css'
import {handleBack, handleNext} from "../../../components/Button/ButtonLogic";
import {
    createPreviewHandler,
    createSaveAndExitHandler,
    createSaveHandler
} from "../../../utils/handlers/formHandlersFactory";
import SyllabusGreen from "../../../assets/images/SyllabusGreen.png"
import SyllabusGrey from "../../../assets/images/SyllabusGrey.png"
import MainImage from "../../../assets/images/BookShelfBackGroundMain.png";

// Functional component that displays the overview page.
const Overview = () => {
    // State to hold the array of section data loaded from the CSV file.
    const [sections, setSections] = useState<SectionData[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");



    //Page Navigation for Buttons
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<Record<string, string>>({});
    const courseID = localStorage.getItem("currentCourseId")

    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage
    };


    const handleBackClick = () => handleBack(navigate, location.pathname, formData, courseID || undefined);
    const handleNextClick = () => handleNext(navigate, location.pathname, formData, courseID || undefined);
    const handleSave = createSaveHandler(formData, modalControls);
    const handleSaveAndExit = createSaveAndExitHandler(formData, navigate, modalControls);
    const handlePreviewClick = createPreviewHandler(formData, modalControls);

    // useEffect runs once on component mount to fetch CSV data
    // using the custom loadSyllabusSections utility function.
    useEffect(() => {
        loadSyllabusSections("/data/syllabus_sections.csv").then(setSections);
    }, []);
    return(
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreviewClick}
            />
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
                          <OverviewCard   title={section.title}
                                           description={section.description}
                                           completed={section.completed}
                                           link={section.link}
                                            imageSrc={section.imageSrc}
                          />
                        </div>
                 ))}

                 <RedirectingModal
                     visible={modalVisible}
                     status={modalStatus}
                        title={modalTitle}
                      message={modalMessage}
                    />
                </div>
            </div>
        </div>
    );
};
export default Overview;