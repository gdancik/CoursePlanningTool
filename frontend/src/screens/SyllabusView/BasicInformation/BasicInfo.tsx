// Imports layout, React, routing, icons, utility functions, and components
import AppLayout from "../../../ApplicationLayout/Applayout";
import React, {useEffect, useState} from "react";
import {getCourseData} from "../../../services/course/courseService"
import {createSaveHandler, createSaveAndExitHandler, createPreviewHandler} from "../../../utils/handlers/formHandlersFactory";
import {useNavigate, useLocation} from "react-router-dom";
import {FaExclamationTriangle } from 'react-icons/fa'
import {loadBasicInfoFields, BasicInfoData} from "../../../utils/loadBasicInfoFields";
import { mapBackendDataToFormFields } from "../../../utils/backendToFormMapper";
import SafeIcon from "../../../utils/ComponentWrapper";
import {handleBack, handleNext,} from "../../../components/Button/ButtonLogic";
import RedirectingModal from "../../../components/RedirectingModal/RedirectingModal";
import SectionAccordion from "./SectionAccordion";
import './BasicInfo.css'



const BasicInfo = () =>{

    // State to store the loaded form fields from CSV
    const [fields, setFields] = useState<BasicInfoData[]>([]);


    //Tracks user-entered form data
    const[formData, setFormData] = useState<Record<string, string>>({})

    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    // React Router navigation and location objects
    const navigate = useNavigate();
    const location = useLocation();


    // Load the basic info fields from CSV when the component mounts
    useEffect(() => {
        const loadCourseData = async () => {
            // 1) Pull the full JSON blob
            const saved = localStorage.getItem("currentCourseData");
            if (!saved) return;

            // 2) Parse and extract the ID
            let course_id: string;
            try {
                const parsed = JSON.parse(saved) as { course_id: string };
                course_id = parsed.course_id;
            } catch {
                console.warn("Could not parse currentCourseData");
                return;
            }

            console.log("Loaded course ID:", course_id);

            // 3) Now fetch the row
            const backendData = await getCourseData(course_id);
            if (backendData) {
                const remapped = mapBackendDataToFormFields(backendData);
                setFormData(remapped);
            }
        };

        loadBasicInfoFields("/data/basic_info_fields.csv").then(setFields);
        loadCourseData();
    }, []);


    // Handle changes to form fields (updates the formData state)
    const handleChange = (label: string, value: string) =>{
        setFormData((prev) => ({...prev, [label]: value}));
    };


    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
    };

    // Button Action Handlers
    const handleSave = createSaveHandler(formData, modalControls);
    const handleSaveAndExit = createSaveAndExitHandler(formData,navigate, modalControls);
    const handlePreviewClick = createPreviewHandler(formData, modalControls);

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

            <RedirectingModal
                visible={modalVisible}
                status={modalStatus}
                title={modalTitle}
                message={modalMessage}
            />

        </div>
    );
};
export default BasicInfo;