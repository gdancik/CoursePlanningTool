import { useEffect, useState, useRef } from "react";
import { handleNext, handleBack } from "../components/Button/ButtonLogic";
import { createSaveAndExitHandler, createPreviewHandler } from "../utils/handlers/previewExitFactory";
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
    const [modalVisible, setModalVisible] = useState(true); // default visible
    const [modalStatus, setModalStatus] = useState<ModalStatus>("loading");
    const [modalTitle, setModalTitle] = useState("Loading Data");
    const [modalMessage, setModalMessage] = useState("Fetching course information...");
    const containerRef = useRef<HTMLDivElement>(null);

    const courseID = localStorage.getItem("currentCourseId");

    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
    };

    // 🟢 Load and cache data when page mounts
    useEffect(() => {
        const cachedData = localStorage.getItem("courseData");
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                setFormData(parsed);
            } catch (err) {
                console.warn("Invalid local cache, ignoring:", err);
            }
        }

        setModalVisible(true);
        setModalStatus("loading");
        setModalTitle("Loading Data");
        setModalMessage("Fetching course information...");

        loadCourseData()
            .then(({ formData: newData }) => {
                setFormData(newData);
                localStorage.setItem("courseData", JSON.stringify(newData));
                setModalVisible(false);
            })
            .catch((err) => {
                console.error("Error loading course data:", err);
                setModalStatus("error");
                setModalTitle("Load Failed");
                setModalMessage(err.message || "Unable to load course data.");
            });
    }, [setFormData]);

    // 🧩 Save logic
    const handleSave = async () => {
        if (!containerRef.current) return;

        try {
            setModalVisible(true);
            setModalStatus("loading");
            setModalTitle("Saving");
            setModalMessage("Saving your changes...");

            await saveData(containerRef);

            setModalStatus("success");
            setModalTitle("Saved");
            setModalMessage("Your changes have been saved successfully!");
            setTimeout(() => setModalVisible(false), 1500);
        } catch (err: any) {
            console.error("Error in saveData:", err);
            setModalStatus("error");
            setModalTitle("Save Failed");
            setModalMessage(err.message || "An unexpected error occurred.");
            setTimeout(() => setModalVisible(false), 2000);
        }
    };

    // 🧠 Navigation Handlers
    return {
        modalVisible,
        modalStatus,
        modalTitle,
        modalMessage,
        modalControls,
        containerRef,
        handleBackClick: () => handleBack(navigate, pathname, formData, courseID || undefined),
        handleNextClick: async () => {
            setModalVisible(true);
            setModalStatus("loading");
            setModalTitle("Loading Next Section");
            setModalMessage("Fetching next section data...");

            try {
                const { formData: newData } = await loadCourseData();
                setFormData(newData);
                localStorage.setItem("courseData", JSON.stringify(newData));
                handleNext(navigate, pathname, newData, courseID || undefined);
                setModalVisible(false);
            } catch (err: any) {
                console.error("Error loading next section:", err);
                setModalStatus("error");
                setModalTitle("Load Failed");
                setModalMessage(err.message || "Unable to load next section.");
                setTimeout(() => setModalVisible(false), 2000);
            }
        },
        handleSave,
        handleSaveAndExit: createSaveAndExitHandler(formData, navigate, modalControls),
        handlePreviewClick: createPreviewHandler(formData, modalControls),
    };
}
