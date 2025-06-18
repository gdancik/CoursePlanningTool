// Imports layout, React, routing, icons, utility functions, and components


import AppLayout from "../../../ApplicationLayout/Applayout";
import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {FaExclamationTriangle } from 'react-icons/fa'
import {loadBasicInfoFields, BasicInfoData} from "../../../utils/loadBasicInfoFields";
import SafeIcon from "../../../utils/ComponentWrapper";
import {handleBack, handleNext, saveJsonFile} from "../../../utils/ButtonLogic";
import {saveToBackend, logoutUser, previewSyllabus} from "../../../services/TestServices/syllabusService";
import SectionAccordion from "./SectionAccordion";
import {jsonFieldsMapper} from "../../../utils/jsonFieldsMapper";
import './BasicInfo.css'



const BasicInfo = () =>{

    // State to store the loaded form fields from CSV
    const [fields, setFields] = useState<BasicInfoData[]>([]);


    //Tracks user-entered form data
    const[formData, setFormData] = useState<Record<string, string>>({})

    // React Router navigation and location objects
    const navigate = useNavigate();
    const location = useLocation();


    // Load the basic info fields from CSV when the component mounts
    useEffect(() => {
        loadBasicInfoFields("/data/basic_info_fields.csv").then(setFields);
        // Load the course modal data JSON

        const storedData = localStorage.getItem("newCourseData");
        if (storedData) {
            try{
                const parsed = JSON.parse(storedData);
                setFormData(parsed);
            } catch (err) {
                console.warn("Failed to parse saved course data:", err);
            }
        }
    }, []);


    // Handle changes to form fields (updates the formData state)
    const handleChange = (label: string, value: string) =>{
        setFormData((prev) => ({...prev, [label]: value}));
    };

    // Button action handlers
    const handleSave = async () => {
        const mappedData = jsonFieldsMapper(formData);
        const course_id = mappedData["course_id"] || "test";

        try{
            await saveToBackend(course_id, mappedData);
            saveJsonFile(mappedData, "form_data.json");
            alert("Saved to backend.")
        } catch (err){
            console.error("Save Error: ", err);
            alert("Failed To Save.")
        }
    };
    const handleSaveAndExit = async () => {
        const mappedData = jsonFieldsMapper(formData);
        const course_id = mappedData["course_id"] || "test";

        try {
            await saveToBackend(course_id, mappedData);
            saveJsonFile(mappedData, "form_data_exit.json");
            await logoutUser();
            navigate("/login");
        } catch (err) {
            console.error("Save & Exit error:", err);
            alert("Failed to save and exit.");
        }
    };

    const handleBackClick = () => handleBack(navigate, location.pathname);
    const handleNextClick = () => handleNext(navigate, location.pathname);

    const handlePreviewClick = async () => {
        const mappedData = jsonFieldsMapper(formData);
        const course_id = mappedData["course_id"] || "test";

        try {
            await saveToBackend(course_id, mappedData);
            const blob = await previewSyllabus(course_id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "syllabus_preview.docx";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Preview failed:", err);
            alert("Failed to generate preview.");
        }
    };


    //Groups fields by section
    const groupedSections = fields.reduce((acc, field)=> {
        if(!acc[field.section]) acc[field.section] = [];
        acc[field.section].push(field);
        return acc;
    },  {} as Record<string, BasicInfoData[]>)

    return (
        <div>
            {/* Application layout that contains button bar actions */}
            <AppLayout
                    onBack={handleBackClick}
                    onNext={handleNextClick}
                    onSave={handleSave}
                    onSaveAndExit={handleSaveAndExit}
                    onPreview={handlePreviewClick}
                   />

            {/* Main form for entering basic info */}
            <form className="basic-info-container">

                {/* Alert at the top to inform users */}
                <div className="alert">
                    <SafeIcon Icon ={FaExclamationTriangle} className="alert-icon"/>
                    Information entered on this page will appear in the final syllabus exactly as written.
                </div>

                {/* Render each section using the SectionAccordion component */}
                {Object.entries(groupedSections).map(([section, sectionFields]) =>(
                    <SectionAccordion
                        key={section}                 // React key for each section
                        sectionName={section}         // Name of the section
                        fields={sectionFields}        // Fields belonging to this section
                        formData={formData}           // Current form data
                        onFieldChange={handleChange}  // Callback for when a field changes
                    />
                ))}
            </form>
        </div>
    );
};
export default BasicInfo;