import { useState } from "react";
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

    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
    };

    const courseID = localStorage.getItem("currentCourseId");

    return {
        modalVisible,
        modalStatus,
        modalTitle,
        modalMessage,
        modalControls,
        handleBackClick: () => handleBack(navigate, pathname, formData, courseID || undefined),
        handleNextClick: () => handleNext(navigate, pathname, formData, courseID || undefined),
        handleSave: createSaveHandler(formData, modalControls),
        handleSaveAndExit: createSaveAndExitHandler(formData, navigate, modalControls),
        handlePreviewClick: createPreviewHandler(formData, modalControls),
    };
}
