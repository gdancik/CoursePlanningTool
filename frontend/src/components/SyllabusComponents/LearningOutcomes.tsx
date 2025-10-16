import React, { useState, useEffect } from 'react';
import ContentCardSet, { CardData } from '../../components/SyllabusComponents/ContentCardSet';
import { useNavigate, useLocation } from "react-router-dom";
import { handleBack, handleNext } from "../../components/Button/ButtonLogic";
import AppLayout from "../../SyllabusLayout/SyllabusPageHeader";
import { 
    createPreviewHandler,
    createSaveAndExitHandler,
    createSaveHandler
} from "../../utils/handlers/formHandlersFactory";
import RedirectingModal from "../../components/RedirectingModal/RedirectingModal";

/**
 * @function LearningOutcomes
 * @description Learning Outcomes component that uses ContentCardSet to manage multiple learning outcome entries.
 * Each learning outcome consists of a title and description field with the ability to add/remove outcomes.
 * Integrates with the syllabus navigation system and data persistence.
 * @returns {JSX.Element} A complete learning outcomes page with navigation and data management
 * @example
 * <LearningOutcomes />
 */

const LearningOutcomes: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [learningOutcomes, setLearningOutcomes] = useState<CardData[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});
    
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
                    const savedFormData = parsed.savedData;
                    setFormData(savedFormData);
                    
                    // Extract learning outcomes from saved data
                    const outcomes: CardData[] = [];
                    let index = 1;
                    
                    while (savedFormData[`Learning Outcome ${index} Title`] !== undefined ||
                           savedFormData[`Learning Outcome ${index} Description`] !== undefined) {
                        outcomes.push({
                            id: index.toString(),
                            title: savedFormData[`Learning Outcome ${index} Title`] || '',
                            description: savedFormData[`Learning Outcome ${index} Description`] || ''
                        });
                        index++;
                    }
                    
                    if (outcomes.length > 0) {
                        setLearningOutcomes(outcomes);
                    }
                }
            } catch (err) {
                console.warn("Failed to parse saved course data:", err);
            }
        };

        loadSavedData();
    }, []);

    // Convert learning outcomes to form data format
    const convertToFormData = (outcomes: CardData[]): Record<string, string> => {
        const newFormData: Record<string, string> = { ...formData };
        
        // Clear existing learning outcome data
        Object.keys(newFormData).forEach(key => {
            if (key.startsWith('Learning Outcome ')) {
                delete newFormData[key];
            }
        });
        
        // Add current learning outcomes
        outcomes.forEach((outcome, index) => {
            const num = index + 1;
            newFormData[`Learning Outcome ${num} Title`] = outcome.title;
            newFormData[`Learning Outcome ${num} Description`] = outcome.description;
        });
        
        return newFormData;
    };

    // Handle learning outcomes changes
    const handleLearningOutcomesChange = (outcomes: CardData[]) => {
        setLearningOutcomes(outcomes);
        const updatedFormData = convertToFormData(outcomes);
        setFormData(updatedFormData);
    };

    // Navigation handlers with form data
    const handleBackClick = () => {
        const updatedFormData = convertToFormData(learningOutcomes);
        handleBack(navigate, location.pathname, updatedFormData, courseID || undefined);
    };

    const handleNextClick = () => {
        const updatedFormData = convertToFormData(learningOutcomes);
        handleNext(navigate, location.pathname, updatedFormData, courseID || undefined);
    };

    // Create action handlers
    const handleSave = createSaveHandler(convertToFormData(learningOutcomes), modalControls);
    const handleSaveAndExit = createSaveAndExitHandler(convertToFormData(learningOutcomes), navigate, modalControls);
    const handlePreview = createPreviewHandler(convertToFormData(learningOutcomes), modalControls);

    return (
        <div className="learning-outcomes-page">
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreview}
            />
            
            <div className="learning-outcomes-content">
                <ContentCardSet
                    setTitle="Learning Outcomes"
                    titleLabel="Learning Outcome {index} Title:"
                    descriptionLabel="Learning Outcome {index} Description:"
                    initialCards={learningOutcomes}
                    onChange={handleLearningOutcomesChange}
                    minCards={2}
                    maxCards={8}
                    showRightValue={false}
                />
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

export default LearningOutcomes;