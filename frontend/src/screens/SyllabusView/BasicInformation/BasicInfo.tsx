import AppLayout from "../../../ApplicationLayout/Applayout";
import React, {useEffect, useState} from "react";
import { FaExclamationTriangle } from 'react-icons/fa'
import {loadBasicInfoFields, BasicInfoData} from "../../../utils/loadBasicInfoFields";
import SafeIcon from "../../../utils/ComponentWrapper";
import SectionAccordion from "./SectionAccordion";
import './BasicInfo.css'



const BasicInfo = () =>{
    const [fields, setFields] = useState<BasicInfoData[]>([]);


    //Tracks user-entered form data
    const[formData, setFormData] = useState<Record<string, string>>({})

    useEffect(() => {
        loadBasicInfoFields("/data/basic_info_fields.csv").then(setFields);
    }, []);


    const handleChange = (label: string, value: string) =>{
        setFormData((prev) => ({...prev, [label]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data to submit:', formData);

        const jsonBlob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(jsonBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'form_data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    //Groups fields by section
    const groupedSections = fields.reduce((acc, field)=> {
        if(!acc[field.section]) acc[field.section] = [];
        acc[field.section].push(field);
        return acc;
    },  {} as Record<string, BasicInfoData[]>)

    return (
        <div>
            <AppLayout/>
            <form className="basic-info-container" onSubmit = {handleSubmit}>
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
                <button type ="submit" className="save-button">Save</button>
            </form>
        </div>
    );
};
export default BasicInfo;