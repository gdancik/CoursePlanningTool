import {useReducer, useState, useRef} from "react";
import { handleNext, handleBack } from "../components/Button/ButtonLogic";
import { createSaveHandler, createSaveAndExitHandler, createPreviewHandler } from "../utils/handlers/formHandlersFactory";
import type { NavigateFunction } from "react-router-dom";

type ModalStatus = "loading" | "success";

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

    const handleSave = () => {
        if (containerRef.current) {
            const jsonString= JSON.stringify(formData, null, 2);
            console.log("Saved Data:", jsonString);

        }

    }


    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
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
