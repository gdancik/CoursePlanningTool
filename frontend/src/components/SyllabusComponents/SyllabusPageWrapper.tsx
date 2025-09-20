import React, { useEffect, useState } from "react";
import AppLayout from "../../SyllabusLayout/SyllabusLayout";
import SafeIcon from "../../utils/ComponentWrapper";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import RedirectingModal from "../../components/RedirectingModal/RedirectingModal";
import { useSyllabusWrapperLogic } from "../../hooks/useSyllabusWrapperLogic";
import { loadCourseData } from "../../utils/loadCourseData";
import { jsonRenderComponent } from "../../components/SyllabusComponents/jsonRendererComponent"; //
import basicInfoLayout from "../../screens/SyllabusView/Data/basic-info-test.json"
import './../../screens/SyllabusView/BasicInformation/BasicInfo.css';

interface SyllabusPageWrapperProps {
    title?: string;
}

const SyllabusPageWrapper: React.FC<SyllabusPageWrapperProps> = ({ title }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<Record<string, string>>({});

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
    } = useSyllabusWrapperLogic(formData, navigate, location.pathname);

    useEffect(() => {
        loadCourseData().then(({ formData }) => setFormData(formData));
    }, []);

    const handleChange = (label: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [label]: value,
        }));
    };

    return (
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreviewClick}
            />

            <form className="course-info-container">
                <div className="alert">
                    <SafeIcon Icon={FaExclamationTriangle} className="alert-icon" />
                    Information entered on this page will appear in the final syllabus exactly as written.
                </div>

                {basicInfoLayout.content.map((component: any, index: number) => (
                    <div key={index}>
                        {jsonRenderComponent(component, formData, handleChange)}
                    </div>
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

export default SyllabusPageWrapper;
