import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleBack, handleNext } from "../../../components/Button/ButtonLogic";
import AppLayout from "../../../ApplicationLayout/Applayout";
import { loadSyllabusContent, SyllabusContent } from "../../../utils/loadSyllabusContent";
import OutcomesAccordian from "./LearningOutcomesAccordian";
import './LearningOutcomes.css'
const LearningOutcomes: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [fields, setFields] = useState<SyllabusContent[]>([]);
    const courseID = localStorage.getItem("currentCourseId");

    useEffect(() => {
        loadSyllabusContent("/data/learning_outcomes_.csv").then(setFields).catch(console.error);
    }, []);

    const handleBackClick = () => handleBack(navigate, location.pathname, formData, courseID || undefined);
    const handleNextClick = () => handleNext(navigate, location.pathname, formData, courseID || undefined);

    const handleFieldChange = (label: string, value: string) => {
        setFormData(prev => ({ ...prev, [label]: value }));
    };

    const sectionNames = Array.from(new Set(fields.map(f => f.section)));


    return (
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
            />

            <form className="outcomes-container">
            {sectionNames.map(sectionName => (
                <OutcomesAccordian
                    key={sectionName}
                    sectionName={sectionName}
                    fields={fields.filter(f => f.section === sectionName)}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />
            ))}
            </form>
        </div>
    );
};

export default LearningOutcomes;
