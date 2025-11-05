import { useEffect, useRef } from "react";
import { handleNext, handleBack } from "../components/Button/ButtonLogic";
import { createSaveAndExitHandler, createPreviewHandler } from "../utils/handlers/previewExitFactory";
import type { NavigateFunction } from "react-router-dom";
import saveData from "../services/processData";
import { loadCourseData } from "../utils/loadCourseData";
import { useModalFactory } from "../utils/useModalFactory"; 

interface SyllabusWrapperLogicResult {
  modal: ReturnType<typeof useModalFactory>;
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
  const modal = useModalFactory();                
  const containerRef = useRef<HTMLDivElement>(null);
  const courseID = localStorage.getItem("currentCourseId");

//Load and data Cache
  useEffect(() => {
    const cachedData = localStorage.getItem("courseData");
    if (cachedData) {
      try {
        setFormData(JSON.parse(cachedData));
      } catch (err) {
        console.warn("Invalid local cache:", err);
      }
    }

    modal.showRedirect("Loading Data", "Fetching course information...");
    loadCourseData()
      .then(({ formData: newData }) => {
        setFormData(newData);
        localStorage.setItem("courseData", JSON.stringify(newData));
        modal.hide();
      })
      .catch((err: any) => {
        console.error("Error loading course data:", err);
        modal.showError(err.message || "Unable to load course data.");
      });
  }, [setFormData]);

  //Saving Logic
  const handleSave = async () => {
    if (!containerRef.current) return;

    try {
      modal.showRedirect("Saving", "Saving your changes...");
      await saveData(containerRef);
      modal.showRedirect("Saved", "Your changes have been saved!", "success");
      setTimeout(() => modal.hide(), 2500);
    } catch (err: any) {
      console.error("Error in saveData:", err);
      modal.showError(err.message || "An unexpected error occurred.");
    }
  };

  //Nav Handlers
  const handleBackClick = () => {
    modal.showRedirect("Loading Previous Section", "Preparing previous section...", "loading");
    setTimeout(() => {
      handleBack(navigate, pathname, formData, courseID || undefined);
      modal.hide();
    }, 800); 
  };

  const handleNextClick = async () => {
    modal.showRedirect("Loading Next Section", "Fetching next section data...");
    try {
      const { formData: newData } = await loadCourseData();
      setFormData(newData);
      localStorage.setItem("courseData", JSON.stringify(newData));
      setTimeout(() => {
             handleNext(navigate, pathname, newData, courseID || undefined);
             modal.hide(); 
      }, 700)
    } catch (err: any) {
      console.error("Error loading next section:", err);
      modal.showError(err.message || "Unable to load next section.");
    }
  };

  return {
    modal,                  
    containerRef,
    handleBackClick,
    handleNextClick,
    handleSave,
    handleSaveAndExit: createSaveAndExitHandler(formData, navigate, {
      setVisible: modal.hide,
      setStatus: () => {},
      setTitle: () => {},
      setMessage: () => {},
    }),
    handlePreviewClick: createPreviewHandler(formData, {
      setVisible: modal.hide,
      setStatus: () => {},
      setTitle: () => {},
      setMessage: () => {},
    }),
  };
}
