import AppLayout from "../../SyllabusLayout/SyllabusLayout";
import {useSyllabusWrapperLogic} from "../../hooks/useSyllabusWrapperLogic";
import React, { useEffect, useState } from "react";
import SafeIcon from "../../utils/ComponentWrapper";
import { FaExclamationTriangle } from "react-icons/fa";
import SectionAccordion from "../../screens/SyllabusView/BasicInformation/SectionAccordion";
import { loadCourseData } from "../../utils/loadCourseData";
import { loadBasicInfoFields, BasicInfoData } from "../../utils/loadBasicInfoFields";
import RedirectingModal from "../../components/RedirectingModal/RedirectingModal";
import { useNavigate, useLocation } from "react-router-dom";
import './../../screens/SyllabusView/BasicInformation/BasicInfo.css'
interface SyllabusPageWrapperProps {
    csvPath: string;
    title?: string;
}


const SyllabusPageWrapper: React.FC<SyllabusPageWrapperProps> = ({ csvPath, title }) => {
    const navigate = useNavigate();
    const location = useLocation();


    const [fields, setFields] = useState<BasicInfoData[]>([]);
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
        loadBasicInfoFields(csvPath).then(setFields);
        loadCourseData().then(({ formData }) => setFormData(formData));
    }, [csvPath]);


    const handleChange = (label: string, value: string) => {
        setFormData((prev) => ({ ...prev, [label]: value }));
    };


    const grouped = fields.reduce((acc, field) => {
        if (!acc[field.section]) acc[field.section] = [];
        acc[field.section].push(field);
        return acc;
    }, {} as Record<string, BasicInfoData[]>);

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


                {Object.entries(grouped).map(([section, sectionFields]) => (
                    <SectionAccordion
                        key={section}
                        sectionName={section}
                        fields={sectionFields}
                        formData={formData}
                        onFieldChange={handleChange}
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
export default SyllabusPageWrapper;