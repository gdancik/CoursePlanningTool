import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleBack, handleNext } from "../../../components/Button/ButtonLogic";
import AppLayout from "../../../SyllabusLayout/SyllabusPageHeader";
import { loadSyllabusContent, SyllabusContent } from "../../../utils/loadSyllabusContent";
import LearningOutcomesAccordion from "./LearningOutcomesAccordionStep1";
import Step2Accordion from "./LearningOutcomesAccordionStep2";
import Step3Accordion from "./LearningOutcomesAccordionStep3";
import Step4Accordion from "./LearningOutcomesAccordionStep4";
import './LearningOutcomes.css';
import {
    createPreviewHandler,
    createSaveAndExitHandler,
    createSaveHandler
} from "../../../utils/handlers/previewExitFactory";
import RedirectingModal from "../../../components/RedirectingModal/RedirectingModal";


const LearningOutcomes: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [fields, setFields] = useState<SyllabusContent[]>([]);

    const courseID = localStorage.getItem("currentCourseId");

    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    // Load syllabus fields on mount
    useEffect(() => {
        const loadFields = async () => {
            const data = await loadSyllabusContent("/data/learning_outcomes_.csv");
            setFields(data);

            // Load saved form data (if any)
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

        loadFields();
    }, []);



    const groupedSections: Record<string, SyllabusContent[]> = fields.reduce((acc, field) => {
        if (!acc[field.section]) acc[field.section] = [];
        acc[field.section].push(field);
        return acc;
    }, {} as Record<string, SyllabusContent[]>);


    const handleFieldChange = (label: string, value: string) => {
        setFormData(prev => ({ ...prev, [label]: value }));
    };

    const step1Fields = fields.filter(f => f.section === "Step 1: Competencies");
    const step2Fields = fields.filter(f => f.section === "Step 2: Purpose and Application");
    const step3Fields = fields.filter(f => f.section === "Step 3: Writing Course-specific Learning Outcomes");
    const step4Fields = fields.filter(f => f.section === "Step 4: Summary")

    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage
    };

    const handleSave = createSaveHandler(formData, modalControls, fields);
    const handleSaveAndExit = createSaveAndExitHandler(formData, navigate, modalControls,fields);
    const handlePreviewClick = createPreviewHandler(formData, modalControls,fields);
    const handleBackClick = () => handleBack(navigate, location.pathname, formData, courseID || undefined);
    const handleNextClick = () => handleNext(navigate, location.pathname, formData, courseID || undefined);


    return (
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreviewClick}
            />

            <form className="outcomes-container">
                <LearningOutcomesAccordion
                    sectionName="Step 1: Competencies"
                    fields={step1Fields}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />

                <Step2Accordion
                    sectionName="Step 2: Purpose and Application"
                    fields={step2Fields}
                />

                <Step3Accordion
                    sectionName="Step 3: Writing Course-specific Learning Outcomes"
                    fields={step3Fields}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />
                <Step4Accordion
                    sectionName="Step 4: Summary"
                    fields={step4Fields}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />
            </form>

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
