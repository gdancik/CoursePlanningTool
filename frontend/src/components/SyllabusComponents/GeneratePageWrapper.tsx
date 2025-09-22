import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RedirectingModal from "../RedirectingModal/RedirectingModal";
import { useSyllabusWrapperLogic } from "../../hooks/useSyllabusWrapperLogic";
import { loadCourseData } from "../../utils/loadCourseData";
import GenerateSyllabusPage from "./GenerateSyllabusPage";
import { JsonComponent } from "./jsonRendererComponent"; // adjust path if needed

// Define props for this wrapper
interface GeneratePageWrapperProps {
    json: JsonComponent[]; // or `{ content: JsonComponent[] }` depending on how you're passing it
}

const GeneratePageWrapper: React.FC<GeneratePageWrapperProps> = ({ json }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState<Record<string, string>>({});

    const {
        modalVisible, modalStatus, modalTitle, modalMessage, modalControls,
        handleBackClick, handleNextClick, handleSave,
        handleSaveAndExit, handlePreviewClick,
    } = useSyllabusWrapperLogic(formData, navigate, location.pathname);

    // Load initial form data
    useEffect(() => {
        loadCourseData().then(({ formData }) => setFormData(formData));
    }, []);

    const handleChange = (label: string, value: string) => {
        setFormData(prev => ({ ...prev, [label]: value }));
    };

    return (
        <>
            <GenerateSyllabusPage
                json={json}
                formData={formData}
                onFieldChange={handleChange}
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreviewClick}
            />
            <RedirectingModal
                visible={modalVisible}
                status={modalStatus}
                title={modalTitle}
                message={modalMessage}
            />
        </>
    );
};

export default GeneratePageWrapper;
