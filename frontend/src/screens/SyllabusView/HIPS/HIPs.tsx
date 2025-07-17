import {useNavigate, useLocation} from "react-router-dom";
import {handleBack,handleNext} from "../../../components/Button/ButtonLogic";
import AppLayout from "../../../ApplicationLayout/Applayout";
import React, {useEffect, useState} from "react";
import {loadSyllabusContent, SyllabusContent} from "../../../utils/loadSyllabusContent";
import {
    createPreviewHandler,
    createSaveAndExitHandler,
    createSaveHandler
} from "../../../utils/handlers/formHandlersFactory";
import HIPSAccordion from "./HIPSAccordion";
import SyllabusSectionAccordion from "../SyllabusComponents/SyllabusAccordion";
import './HIPS.css'


const HIPs = () => {
    //Page Navigation for Buttons
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [fields, setFields] = useState<SyllabusContent[]>([]);

    const courseID = localStorage.getItem("currentCourseId");

    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() => {
        const loadFields = async () => {
            const data = await loadSyllabusContent("/data/HIPS.csv");
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
    const HIPSAccordionFields = fields.filter(f => f.section === "Step 1: Understanding High Impact Practices");

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
            <form className="HIPS-container">
                <HIPSAccordion
                    sectionName="Step 1: Understanding High Impact Practices"
                    fields={HIPSAccordionFields}
                />
                {Object.entries(groupedSections).map(([section, sectionFields]) => (
                    section !== "Step 1: Understanding High Impact Practices" && (
                    <SyllabusSectionAccordion
                        key = {section}
                        sectionName={section}
                        fields={sectionFields}
                        formData={formData}
                        onFieldChange={handleFieldChange}
                    />
                    )
                ))}
            </form>
        </div>
    );
};
export default HIPs;