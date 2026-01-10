import {useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import { FaAngleUp, FaEdit } from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import {isSectionComplete, ValidInputsResponse, fetchRequiredInputs} from "../../services/validInputsService";
import Information from "../../components/SyllabusComponents/Information";
import {CardData, ContentCardSet} from "../../components/SyllabusComponents/ContentCardSet"

import "./Checklist.css";

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    link: string;
    sectionId: string;
}

interface PolicyItem {
    id: string;
    label: string;
}

const Checklist = ({ formData, additional_sections_id, policy_checkboxes, resources_checkboxes }: 
    { formData: Record<string, string>,
      additional_sections_id: string,
      policy_checkboxes: string,
      resources_checkboxes:string
    },
       
) => {
    //Page Navigation for Buttons
    const navigate = useNavigate();
    const location = useLocation();

    //const [formData, setFormData] = useState<Record<string, string>>({});
    const [validInputs, setValidInputs] = useState<ValidInputsResponse>({});
    
    const [initialCards, setInitialCards] = useState<CardData[]>([]);

    // State for optional sections
    const [additionalSections, setAdditionalSections] = useState<Array<{title: string, content: string}>>([]);
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [newSectionContent, setNewSectionContent] = useState("");
    
    // State for policy statements and resources
    const [selectedPolicies, setSelectedPolicies] = useState<Set<string>>(new Set());
    const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());

    // Checklist items matching syllabus sections
    const checklistItems: ChecklistItem[] = [
        {
            id: "basic_info",
            title: "Basic Information",
            description: "Have you entered the detailed information about the course into the instructor?",
            link: "/basic-info",
            sectionId: "basic_information"
        },
        {
            id: "description",
            title: "Course Description",
            description: "Have you outlined the overarching goals of the course, and the type of experience do you want your students to have in this course?",
            link: "/course-description",
            sectionId: "course_description"
        },
        {
            id: "learning_outcomes",
            title: "Learning Outcomes",
            description: "Have you clearly articulated the Competencies and Learning Outcomes that effectively communicate and engage students in pursuing these outcomes?",
            link: "/learning-outcomes",
            sectionId: "learning_outcomes"
        },
        {
            id: "hips",
            title: "High Impact Practices (HIPs)",
            description: "Have you incorporated High Impact Practices in your course?",
            link: "/hips",
            sectionId: "hips"
        },
        {
            id: "learning_resources",
            title: "Learning Resources",
            description: "Have you listed all required materials for your course, such as textbooks, software, lab equipment, and other resources?",
            link: "/learning-resources",
            sectionId: "learning_resources"
        },
        {
            id: "assessment",
            title: "Assessment",
            description: "Have you connected the course materials and assignments explicitly to your learning outcomes?",
            link: "/assessment",
            sectionId: "assessment"
        },
        {
            id: "schedule",
            title: "Course Schedule",
            description: "Have you drafted a clear schedule that outlined the detailed learning outcomes addressed and readings/assignments due?",
            link: "/course-schedule",
            sectionId: "course_schedule"
        }
    ];

    const policyStatements: PolicyItem[] = [
        { id: "academic_integrity", label: "Academic Integrity Policy" },
        { id: "diversity", label: "Diversity Statement" },
        { id: "final_exam", label: "Final Examination Statement" },
        { id: "sexual_misconduct", label: "Student Sexual Misconduct Statement" },
        { id: "weather", label: "Weather Policy" }
    ];

    const resources: PolicyItem[] = [
        { id: "academic_success", label: "Academic Success Center" },
        { id: "accommodations", label: "Accommodations for Students with Disabilities" },
        { id: "writing", label: "Writing Assistance" },
        { id: "math_tutoring", label: "Math Tutoring Statement" },
        { id: "counseling", label: "Counseling and Psychological Services" },
        { id: "student_wellness", label: "Statement on Student Wellness" }
    ];

        // useEffect runs once on component mount to fetch CSV data and API data
        useEffect(() => {
                
            // Uncomment this when backend is running:
             fetchRequiredInputs().then(setValidInputs)
                 .catch(error => {
                     console.error('Failed to fetch valid inputs:', error);
                     //setValidInputs({});
             });            
    
        }, []);
    
        useEffect(() =>{
            const raw = formData[additional_sections_id];
            const ic: CardData[] = Array.isArray(raw) ? raw : [];
            setInitialCards(ic);
        }, [formData])
    
    const checkSectionComplete = (sectionId: string): boolean => {        
        return isSectionComplete(sectionId, validInputs, formData);
    };

    
    const togglePolicy = (policyId: string) => {
        const newSet = new Set(selectedPolicies);
        if (newSet.has(policyId)) {
            newSet.delete(policyId);
        } else {
            newSet.add(policyId);
        }
        setSelectedPolicies(newSet);
    };

    const toggleResource = (resourceId: string) => {
        const newSet = new Set(selectedResources);
        if (newSet.has(resourceId)) {
            newSet.delete(resourceId);
        } else {
            newSet.add(resourceId);
        }
        setSelectedResources(newSet);
    };

    const toggleAllPolicies = () => {
        if (selectedPolicies.size === policyStatements.length) {
            setSelectedPolicies(new Set());
        } else {
            setSelectedPolicies(new Set(policyStatements.map(p => p.id)));
        }
    };

    const toggleAllResources = () => {
        if (selectedResources.size === resources.length) {
            setSelectedResources(new Set());
        } else {
            setSelectedResources(new Set(resources.map(r => r.id)));
        }
    };

    return (
        <div>
            <div className="checklist-page">
                <div className="checklist-container">
                    {/* Step 1: Syllabus Checklist */}
                    <div className="checklist-section">
                        <details open>
                            <summary className="checklist-section-header">
                                <div className="checklist-header-content">
                                    <div className="checklist-icon-wrapper">
                                        <svg className="checklist-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 11L12 14L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className="checklist-step-title">Step 1: Syllabus Checklist</span>
                                </div>
                                <SafeIcon Icon={FaAngleUp} className="checklist-arrow" />
                            </summary>
                            
                            <div className="checklist-content">
                                <p className="checklist-instructions">
                                    Click on the green button and download your draft syllabus in .Word document. Examine the syllabus and use the checklist below to ensure 
                                    that you have completed each section. Go back to previous steps and make revisions as needed. After completing all sections, you'll be able to 
                                    download the syllabus directly from the Home page for this course.
                                </p>

                                <div className="checklist-items">
                                    {checklistItems.map(item => (
                                        <div key={item.id} className="checklist-item">
                                            <div className="checklist-item-checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    id={item.id}
                                                    checked={checkSectionComplete(item.sectionId)}
                                                    readOnly
                                                    aria-label={`${item.title} completed`}
                                                />
                                                <label htmlFor={item.id}></label>
                                            </div>
                                            <div className="checklist-item-content">
                                                <h3 className="checklist-item-title">{item.title}</h3>
                                                <p className="checklist-item-description">{item.description}</p>
                                            </div>
                                            <button 
                                                className="checklist-edit-btn"
                                                onClick={() => navigate(item.link)}
                                                aria-label={`Edit ${item.title}`}
                                            >
                                                <SafeIcon Icon={FaEdit} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>

                    {/* Step 2: Additional Syllabus Sections */}
                    <div className="checklist-section">
                        <details open>
                            <summary className="checklist-section-header">
                                <div className="checklist-header-content">
                                    <div className="checklist-icon-wrapper">
                                        <svg className="checklist-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className="checklist-step-title">Step 2: Additional Syllabus Sections (Optional)</span>
                                </div>
                                <SafeIcon Icon={FaAngleUp} className="checklist-arrow" />
                            </summary>
                            
                            <div className="checklist-content">
                                <p className="checklist-instructions">
                                    You can add additional sections to your syllabus. These sections will appear after the Course Schedule section.
                                </p>

                                
                                <div className="add-section-form">                                    
                                    
                                    <Information text="Information entered below will appear in the final syllabus exactly as written."/>
                                    &nbsp;                                

                                     <ContentCardSet
                                                id = {additional_sections_id}
                                                setTitle="Additional Sections"
                                                titleLabel="Additional Section {index} Title:"
                                                descriptionLabel="Additional Section {index} Description:"
                                                initialCards={initialCards} 
                                                onChange = {() => {}}           
                                                minCards={1}
                                                maxCards={3}
                                                separateLabel={false}    
                                            />

                                   
                                </div>
                            </div>
                        </details>
                    </div>

                    {/* Step 3: Policy Statements & Resources */}
                    <div className="checklist-section">
                        <details open>
                            <summary className="checklist-section-header">
                                <div className="checklist-header-content">
                                    <div className="checklist-icon-wrapper">
                                        <svg className="checklist-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className="checklist-step-title">Step 3: Add Policy Statements & Resources (Optional)</span>
                                </div>
                                <SafeIcon Icon={FaAngleUp} className="checklist-arrow" />
                            </summary>
                            
                            <div className="checklist-content">
                                <p className="checklist-instructions">
                                    Select which Policy Statements you'd like to include in your syllabus.
                                </p>

                                <div className="policy-resources-grid">
                                    <div className="policy-column">
                                        <div className="column-header">
                                            <h3>Policy Statements</h3>
                                            <label className="check-all">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedPolicies.size === policyStatements.length}
                                                    onChange={toggleAllPolicies}
                                                    aria-label="Check all policy statements"
                                                />
                                                <span>Check All</span>
                                            </label>
                                        </div>
                                        <div className="checkbox-list">
                                            {policyStatements.map(policy => (
                                                <label key={policy.id} className="checkbox-item">
                                                    <input 
                                                        type="checkbox"
                                                        checked={selectedPolicies.has(policy.id)}
                                                        onChange={() => togglePolicy(policy.id)}
                                                    />
                                                    <span>{policy.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="policy-column">
                                        <div className="column-header">
                                            <h3>Resources</h3>
                                            <label className="check-all">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedResources.size === resources.length}
                                                    onChange={toggleAllResources}
                                                    aria-label="Check all resources"
                                                />
                                                <span>Check All</span>
                                            </label>
                                        </div>
                                        <div className="checkbox-list">
                                            {resources.map(resource => (
                                                <label key={resource.id} className="checkbox-item">
                                                    <input 
                                                        type="checkbox"
                                                        checked={resource.id === "accommodations" || selectedResources.has(resource.id)}
                                                        onChange={() => toggleResource(resource.id)}
                                                    />
                                                    <span>
                                                        {resource.id === "accommodations" ?
                                                        <>
                                                            {resource.label} (<b>Required</b>) 
                                                        </>
                                                        :
                                                            resource.label
                                                        }                                                       
                                                    </span>                                                    
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Checklist;