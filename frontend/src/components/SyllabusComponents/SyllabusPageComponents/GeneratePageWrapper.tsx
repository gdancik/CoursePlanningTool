import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RedirectingModal from "../../RedirectingModal/RedirectingModal";
import { useSyllabusWrapperLogic } from "../../../hooks/useSyllabusWrapperLogic";
import { loadCourseData } from "../../../utils/loadCourseData";
import GenerateSyllabusPage from "./GenerateSyllabusPage";
import { JsonComponent } from "../../../utils/jsonRenderer";

// Define props for this wrapper
interface GeneratePageWrapperProps {
    json: JsonComponent[];
}

const GeneratePageWrapper: React.FC<GeneratePageWrapperProps> = ({ json }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Holds all field data for this page
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [courseId, setCourseId] = useState<string | null>(null);

    const {
        modalVisible, modalStatus, modalTitle, modalMessage, modalControls,
        handleBackClick, handleNextClick, handleSave,
        handleSaveAndExit, handlePreviewClick, containerRef
    } = useSyllabusWrapperLogic(formData, navigate, location.pathname);

    //
    useEffect(() => {
        const fetchData = async () => {
            const { courseId, formData } = await loadCourseData();
            setCourseId(courseId);
            setFormData(formData);
        };

        fetchData();
    }, []);

    // Handles local changes to any input fields
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
                containerRef={containerRef}
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