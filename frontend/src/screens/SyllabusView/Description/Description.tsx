import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {handleBack,handleNext} from "../../../components/Button/ButtonLogic";
import {loadSyllabusContent, SyllabusContent }from "../../../utils/loadSyllabusContent"
import AppLayout from "../../../ApplicationLayout/Applayout";
import {
    createPreviewHandler,
    createSaveAndExitHandler,
    createSaveHandler
} from "../../../utils/handlers/formHandlersFactory";


const Description = () => {

    const [fields, setFields] = useState<SyllabusContent[]>([]);

    const[DescrptionData, setDescriptionData] = useState<Record<string, string>>({})

    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");


    //Page Navigation for Buttons
    const navigate = useNavigate();
    const location = useLocation();

    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
    };


    const handleBackClick = () => handleBack(navigate, location.pathname);
    const handleNextClick = () => handleNext(navigate, location.pathname);

    //Load Syllabus Content Data
    useEffect(() => {
        loadSyllabusContent("/data/description_info.csv").then(setFields);
    }, []);

    //Button Action Handlers
    const handleSave = createSaveHandler(DescrptionData, modalControls);
    const handleSaveAndExit = createSaveAndExitHandler(DescrptionData,navigate, modalControls);
    const handlePreviewClick = createPreviewHandler(DescrptionData, modalControls);


    return (
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
                onSave = {handleSave}
                onSaveAndExit={handleSaveAndExit}
                onPreview={handlePreviewClick}
            />
            <h1>Description Page</h1>
        </div>
    );
};
export default Description;