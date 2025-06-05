import AppLayout from "../../../ApplicationLayout/Applayout";
import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { FaExclamationTriangle } from 'react-icons/fa'
import {loadBasicInfoFields, BasicInfoData} from "../../../utils/loadBasicInfoFields";
import SafeIcon from "../../../utils/ComponentWrapper";
import {saveJsonFile} from "../../../utils/ButtonLogic";
import {handleBack, handleNext, handlePreview} from "../../../utils/ButtonLogic";
import SectionAccordion from "./SectionAccordion";
import './BasicInfo.css'



const BasicInfo = () =>{
    const [fields, setFields] = useState<BasicInfoData[]>([]);


    //Tracks user-entered form data
    const[formData, setFormData] = useState<Record<string, string>>({})

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadBasicInfoFields("/data/basic_info_fields.csv").then(setFields);
    }, []);


    const handleChange = (label: string, value: string) =>{
        setFormData((prev) => ({...prev, [label]: value}));
    };

    // Provide actual logic for button clicks!
    const handleSave = () => saveJsonFile(formData, "form_data.json");
    const handleSaveAndExit = () => saveJsonFile(formData, "form_data_exit.json");
    const handleBackClick = () => handleBack(navigate, location.pathname);
    const handleNextClick = () => handleNext(navigate, location.pathname);

    //Groups fields by section
    const groupedSections = fields.reduce((acc, field)=> {
        if(!acc[field.section]) acc[field.section] = [];
        acc[field.section].push(field);
        return acc;
    },  {} as Record<string, BasicInfoData[]>)

    return (
        <div>
            <AppLayout
                    onBack={handleBackClick}
                    onNext={handleNextClick}
                    onSave={handleSave}
                    onSaveAndExit={handleSaveAndExit}
                    onPreview={handlePreview}
                   />
            <form className="basic-info-container">
                <div className="alert">
                    <SafeIcon Icon ={FaExclamationTriangle} className="alert-icon"/>
                    Information entered on this page will appear in the final syllabus exactly as written.
                </div>
                {Object.entries(groupedSections).map(([section, sectionFields]) =>(
                    <SectionAccordion
                        key = {section}
                        sectionName={section}
                        fields={sectionFields}
                        formData={formData}
                        onFieldChange={handleChange}
                    />
                ))}

            </form>
        </div>
    );
};
export default BasicInfo;