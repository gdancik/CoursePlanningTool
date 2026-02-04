// Overview page.
// This page pulls data from a CSV file to dynamically load OverviewCards,
// which are displayed in a summary format for each section of the syllabus.
// The card components are defined in components/OverviewCard.
// A linker map for navigation buttons is handled in AppNavigation (not shown here).

import React, {useEffect, useState} from 'react';
import OverviewCard from "./OverviewCard";
import {isSectionComplete, ValidInputsResponse, fetchRequiredInputs} from "../../services/validInputsService";

import './Overview.css'

import config from '../../config.json';

import SyllabusGreen from "../../assets/images/SyllabusGreen.png"
import SyllabusGrey from "../../assets/images/SyllabusGrey.png"

// Functional component that displays the overview page.
const OverviewComponent = ({ formData }: { formData: Record<string, string> }) => {
    
    const [validInputs, setValidInputs] = useState<ValidInputsResponse>({});
    
    const sections = [
            {
                "id":"1",
                "section_id":"basic_information","title":"Basic Information",
                "description":"In this section, you can enter all the essential information about the course and the instructor.",
                "completed":false,
                "link":"/basic-info",
                "imageSrc":"/images/BasicInfo.png"
            },{
                "id":"2",
                "section_id":"course_description",
                "title":"Course Description",
                "description":"This section guides you through a two-step planning process to draft your course description, first by articulating a clear vision, then by reflecting on the course's broader context.",
                "completed":false,
                "link":"/course-description",
                "imageSrc":"/images/CourseDescription.png"
            },{
                "id":"3",
                "section_id":"learning_outcomes",
                "title":"Learning Outcomes",
                "description":"In this section, you'll define the learning outcomes students are expected to demonstrate by the end of the course. Using the provided planning tools, you'll integrate relevant competencies from ELAC's five skill-based areas, along with any additional outcomes specified to your course.",
                "completed":false,
                "link":"/learning-outcomes","imageSrc":
                "/images/LearningOutcomesImage.png"
            },{
                "id":"4",
                "section_id":"high_impact_practices",
                "title":"High-Impact Practices (HIPs)",
                "description":"High-Impact Practices (HIPs) have been shown to enhance student learning and engagement by encouraging the application of knowledge in both academic and real-world contexts. If your course is part of the ELAC program, it must incorporate at least one High-Impact Practice. The planning tools provided will help guide you through selecting and implementing an appropriate practice.",
                "completed":false,
                "link":"/hips",
                "imageSrc":"/images/HipsImage.png"
            },{
                "id":"5",
                "section_id":"learning_resources",
                "title":"Learning Resources",
                "description":"Use this section to list all required materials for your course, such as text books, software, lab equipment, and other resources.",
                "completed":false,
                "link":"/learning-resources",
                "imageSrc":"/images/LearningResources.png"
            },{
                "id":"6",
                "section_id":"assessment",
                "title":"Assessment",
                "description":"The planning tools in this section will support you in designing both formative and summative assignments that align with your course goals and learning outcomes, as well as grading criteria.",
                "completed":false,
                "link":"/assessment",
                "imageSrc":"/images/Assessment.png"
            },{
                "id":"7",
                "section_id":"course_schedule",
                "title":"Course Schedule",
                "description":"This section provides convenient tools to help you build your course schedule, outlining each unit and topic, the learning outcomes addressed, and the reading and assignments due for each class session.",
                "completed":false,
                "link":"/course-schedule",
                "imageSrc":"/images/CourseSchedule.png"
            },{
                "id":"8",
                "section_id":"checklist",
                "title":"Checklist",
                "description":"Use the checklist to ensure your syllabus includes all required components, communicates effectively with students, and offers the option to add relevant policy statements.",
                "completed":false,
                "link":"/checklist",
                "imageSrc":"/images/Checklist.png"
            }]

    // useEffect runs once on component mount to fetch CSV data and API data
    useEffect(() => {
            
        // Uncomment this when backend is running:
         fetchRequiredInputs().then(setValidInputs)
             .catch(error => {
                 console.error('Failed to fetch valid inputs:', error);
                 //setValidInputs({});
         });            

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
   
    /* Introduction message to help users understand the tool */
    const OverviewIntro = () => {
        
        return (
            <p className="overview-intro"> 
            This course planning tool will walk you through the steps of building
            evidence-based courses and produces a downloadable, editable syllabus in Word. The creators of this
            tool recognize that course planning is not always a linear process and so you can navigate
            through the steps in a way that works for your course planning approach.
            You can: <p>&nbsp;</p>
            <p>
                <ul>
                    <li>Skip and come back to sections</li>
                    <li>Save over previous answers</li>
                    <li>Complete the course planning over multiple sittings</li>
                </ul>                
            </p> 
            <p>&nbsp;</p>
            
            <p>
                The tool itself will support you in providing the content of your course syllabus. Some of the
                questions present in the tool are geared to help you build your course and will not appear in the
                syllabus itself.
            </p>
            <p>&nbsp;</p>
            <p>
                    The fields that show up on your syllabus are in <span
                className="green-text">green</span> throughout the tool*
            </p>   

                <img src ={SyllabusGreen} alt="SyllabusGreen" className="Syllabus-green-box"/>  
                <p style = {{fontWeight: 'normal'}}>For text appearing in the syllabus, you can 
                    use **text** to bold <b>text</b>, *text* to italicize <i>text</i>, and
                    ***text*** for bold and italicized <b><i>text</i></b>. </p>
                <p>&nbsp;</p>                  
                <p>The fields that are brainstorming and do not show up on your syllabus are in gray.</p>
                <img src={SyllabusGrey} alt="SyllabusGrey" className="Syllabus-grey-box"/>
                      <p>&nbsp;</p>
                <p>If you would like to add images or figures to your syllabus, you should do so AFTER you have downloaded the syllabus into Word.</p>
                <p>You can store up to {config.max_courses} syllabi in the course planning tool at a time.</p>
            </p>
        )
    }


    return(
              
                <div className='overview-container'>

                 <OverviewIntro/>
                 
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
             
            </div>    
    );
};
export default OverviewComponent;


