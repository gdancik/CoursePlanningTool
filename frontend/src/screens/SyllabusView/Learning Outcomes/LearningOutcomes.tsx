import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleBack, handleNext } from "../../../components/Button/ButtonLogic";
import AppLayout from "../../../ApplicationLayout/Applayout";
import { loadSyllabusContent, SyllabusContent } from "../../../utils/loadSyllabusContent";
import LearningOutcomesAccordion from "./LearningOutcomesAccordionStep1";
import Step2Accordion from "./LearningOutcomesAccordionStep2";
import Step3Accordion from "./LearningOutcomesAccordionStep3";
import './LearningOutcomes.css';


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

    const step1Fields = fields.filter(f => f.section === "Step 1: Competencies");
    const step2Fields = fields.filter(f => f.section === "Step 2: Purpose and Application");
    const step3Fields = fields.filter(f => f.section === "Step 3: Writing Course-specific Learning Outcomes");

    return (
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
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
            </form>
        </div>
    );
};

export default LearningOutcomes;
