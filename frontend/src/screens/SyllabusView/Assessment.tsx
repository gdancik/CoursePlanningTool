import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleBack, handleNext } from "../../components/Button/ButtonLogic";
import AppLayout from "../../SyllabusLayout/SyllabusPageHeader";
import {
    createPreviewHandler,
    createSaveAndExitHandler,
    createSaveHandler
} from "../../utils/handlers/formHandlersFactory";
import RedirectingModal from "../../components/RedirectingModal/RedirectingModal";
import Assignments from "../../components/SyllabusComponents/Assignments";
import GradingPolicies from "../../components/SyllabusComponents/GradingPolicies";
import { CardData } from "../../components/SyllabusComponents/ContentCardSet";
import './Assessment.css';

const Assessment: React.FC = () => {
    // Page Navigation for Buttons
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [assignments, setAssignments] = useState<CardData[]>([]);
    const [gradingPolicies, setGradingPolicies] = useState<CardData[]>([]);
    const courseID = localStorage.getItem("currentCourseId");

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    // Modal controls
    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
    };

    // Load saved data on component mount
    useEffect(() => {
        const loadSavedData = () => {
            const saved = localStorage.getItem("currentCourseData");
            if (!saved) return;

            try {
                const parsed = JSON.parse(saved);
                if (parsed.course_id && parsed.savedData) {
                    setFormData(parsed.savedData);
                }
            } catch (err) {
                console.warn("Failed to parse saved course data:", err);
            }
        };

        loadSavedData();
    }, []);

    // Convert components data to form data format
    const convertToFormData = (): Record<string, string> => {
        const newFormData: Record<string, string> = { ...formData };
        
        // Clear existing assessment data
        Object.keys(newFormData).forEach(key => {
            if (key.startsWith('Assignment ') || key.startsWith('Grading Policy ')) {
                delete newFormData[key];
            }
        });
        
        // Add current assignments
        assignments.forEach((assignment, index) => {
            const num = index + 1;
            newFormData[`Assignment ${num} Title`] = assignment.title;
            newFormData[`Assignment ${num} Description`] = assignment.description;
            newFormData[`Assignment ${num} Points`] = assignment.rightValue || '';
        });
        
        // Add current grading policies
        gradingPolicies.forEach((policy, index) => {
            const num = index + 1;
            newFormData[`Grading Policy ${num} Title`] = policy.title;
            newFormData[`Grading Policy ${num} Description`] = policy.description;
        });
        
        return newFormData;
    };

    // Handle data changes
    const handleAssignmentsChange = (newAssignments: CardData[]) => {
        setAssignments(newAssignments);
    };

    const handleGradingPoliciesChange = (newPolicies: CardData[]) => {
        setGradingPolicies(newPolicies);
    };

    // Navigation handlers with form data
    const handleBackClick = () => {
        const updatedFormData = convertToFormData();
        handleBack(navigate, location.pathname, updatedFormData, courseID || undefined);
    };

    const handleNextClick = () => {
        const updatedFormData = convertToFormData();
        handleNext(navigate, location.pathname, updatedFormData, courseID || undefined);
    };

    // Create action handlers
    const handleSave = createSaveHandler(convertToFormData(), modalControls);
    const handleSaveAndExit = createSaveAndExitHandler(convertToFormData(), navigate, modalControls);
    const handlePreview = createPreviewHandler(convertToFormData(), modalControls);

    return (
        <div className="assessment-page">
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreview}
            />
            
            <div className="assessment-content">
                <div className="assessment-section">
                    <Assignments 
                        onChange={handleAssignmentsChange}
                        initialData={assignments}
                    />
                </div>
                
                <div className="assessment-section">
                    <GradingPolicies 
                        onChange={handleGradingPoliciesChange}
                        initialData={gradingPolicies}
                    />
                </div>
            </div>

            {/* Modal for save/preview actions */}
            <RedirectingModal
                visible={modalVisible}
                status={modalStatus}
                title={modalTitle}
                message={modalMessage}
            />
        </div>
    );
};
export default Assessment;