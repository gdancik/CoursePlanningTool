import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppLayout from "../../../SyllabusLayout/SyllabusPageHeader";
import {
    createPreviewHandler,
    createSaveAndExitHandler,
    createSaveHandler
} from "../../../utils/handlers/formHandlersFactory";
import { handleBack, handleNext } from "../../../components/Button/ButtonLogic";
import RedirectingModal from "../../../components/RedirectingModal/RedirectingModal";
import { loadSyllabusContent, SyllabusContent } from "../../../utils/loadSyllabusContent";
import SyllabusSectionAccordion from "../../../components/SyllabusComponents/SyllabusAccordion";
import "./Description.css";

const Description = () => {
    const [fields, setFields] = useState<SyllabusContent[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const courseID = localStorage.getItem("currentCourseId")


    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Load syllabus fields on mount
    useEffect(() => {
        const loadFields = async () => {
            const data = await loadSyllabusContent("/data/description_info.csv");
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

    // Group fields by section
    const groupedSections: Record<string, SyllabusContent[]> = fields.reduce((acc, field) => {
        if (!acc[field.section]) acc[field.section] = [];
        acc[field.section].push(field);
        return acc;
    }, {} as Record<string, SyllabusContent[]>);

    // Handle field input changes
    const handleFieldChange = (label: string, value: string) => {
        setFormData((prev) => ({ ...prev, [label]: value }));
    };

    // Modal config for save/preview
    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage
    };

    // Navigation + actions
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

            <form className="description-form-container">

                {Object.entries(groupedSections).map(([section, sectionFields]) => (
                    <SyllabusSectionAccordion
                        key={section}
                        sectionName={section}
                        fields={sectionFields}
                        formData={formData}
                        onFieldChange={handleFieldChange}
                    />
                ))}
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

export default Description;
