import {useReducer, useState, useRef} from "react";
import { handleNext, handleBack } from "../components/Button/ButtonLogic";
import { createSaveHandler, createSaveAndExitHandler, createPreviewHandler } from "../utils/handlers/previewExitFactory";
import type { NavigateFunction } from "react-router-dom";
import saveData from "../services/processData";
import { loadCourseData } from "../utils/loadCourseData";

type ModalStatus = "loading" | "success" | "error";

interface SyllabusWrapperLogicResult {
    modalVisible: boolean;
    modalStatus: ModalStatus;
    modalTitle: string;
    modalMessage: string;
    modalControls: {
        setVisible: (value: boolean) => void;
        setStatus: (status: ModalStatus) => void;
        setTitle: (title: string) => void;
        setMessage: (message: string) => void;
    };
    containerRef: React.RefObject<HTMLDivElement | null>;
    handleBackClick: () => void;
    handleNextClick: () => void;
    handleSave: () => void;
    handleSaveAndExit: () => void;
    handlePreviewClick: () => void;
}

export function useSyllabusWrapperLogic(
    formData: Record<string, string>,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    navigate: NavigateFunction,
    pathname: string
): SyllabusWrapperLogicResult {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<ModalStatus>("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const courseID = localStorage.getItem("currentCourseId");



    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
    };

    const handleSave = async () =>  {
        if(!containerRef.current) {
            console.log("containerRef not attached");
            return;
        }
        try {
            setModalVisible(true);
            setModalStatus("loading");
            setModalTitle("Saving");
            setModalMessage("Saving your changes...");

            await saveData(containerRef);

            setModalStatus("success");
            setModalTitle("Saved");
            setModalMessage("Your changes have been saved successfully!");
        } catch (err: any) {
            console.error("Error in saveData:", err);
            setModalStatus("error");
            setModalTitle("Save Failed");
            setModalMessage(err.message || "An unexpected error occurred.");
        } finally {
            setTimeout(() => setModalVisible(false), 1500);
        }
    };


    return {
        modalVisible,
        modalStatus,
        modalTitle,
        modalMessage,
        modalControls,
        containerRef,
        handleBackClick: () => handleBack(navigate, pathname, formData, courseID || undefined),
        handleNextClick: async () => {
            try{ 
                setModalVisible(true);
                setModalStatus("loading");
                setModalTitle("Loading Section");
                setModalMessage("Please wait while we load your data...");
                const { formData: newData} = await loadCourseData();
                setFormData(newData);

                setModalStatus("success");
                setModalTitle("Loaded")
                setModalMessage("Your next section has been loaded successfully");
                setTimeout(() => {
                    handleNext(navigate, pathname, newData, courseID || undefined);
                    setModalVisible(false);
                }, 1000);
            } catch(err: any) {
                console.error("Error loading Course Data: ",err);
                setModalStatus("error");
                setModalTitle("Load Failed");
                setModalMessage(err.message || "unable to load the next section.")

                setTimeout(() => setModalVisible(false),2000);
            }
        },
        handleSave,
        handleSaveAndExit: createSaveAndExitHandler(formData, navigate, modalControls),
        handlePreviewClick: createPreviewHandler(formData, modalControls),
    };
}
