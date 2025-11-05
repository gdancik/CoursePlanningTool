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
    const [isLoading, setIsLoading] = useState(true);

    const {
        modalVisible,
        modalStatus,
        modalTitle,
        modalMessage,
        modalControls,
        handleBackClick,
        handleNextClick,
        handleSave,
        handleSaveAndExit,
        handlePreviewClick,
        containerRef
    } = useSyllabusWrapperLogic(formData, setFormData, navigate, location.pathname);

    //
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const cached = localStorage.getItem("courseData");
            if(cached) {
                try {
                    const parsed = JSON.parse(cached);
                    setFormData(parsed);
                } catch {
                    console.warn("Invalid cached course Data.")
                }
            }
            try {
                const {courseId, formData: newData} = await loadCourseData();
                setCourseId(courseId)
                setFormData(newData);
                localStorage.setItem("courseData", JSON.stringify(newData));
            } catch (err: any) {
                console.error("Error loading coures data:", err);
                modalControls.setVisible(true);
                modalControls.setStatus("error");
                modalControls.setTitle("Load Failed");
                modalControls.setMessage(err.message || "unable to load course data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("Form Data Updated:", formData);
    }, [formData]);

    // Handles local changes to any input fields
    const handleChange = (label: string, value: string) => {
        setFormData(prev => ({ ...prev, [label]: value }));
    };
    if (isLoading) {
        return(
        <RedirectingModal visible={true} status="loading" title="Loading data" message="Fetching Course information..."/>
        )
    }

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
        </>
    );
};

export default GeneratePageWrapper;