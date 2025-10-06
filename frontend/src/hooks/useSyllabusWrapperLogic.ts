import {useReducer, useState, useRef} from "react";
import { handleNext, handleBack } from "../components/Button/ButtonLogic";
import { createSaveHandler, createSaveAndExitHandler, createPreviewHandler } from "../utils/handlers/formHandlersFactory";
import type { NavigateFunction } from "react-router-dom";
import saveData from "../services/processData";

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
        handleNextClick: () => handleNext(navigate, pathname, formData, courseID || undefined),
        handleSave,
        handleSaveAndExit: createSaveAndExitHandler(formData, navigate, modalControls),
        handlePreviewClick: createPreviewHandler(formData, modalControls),
    };
}
