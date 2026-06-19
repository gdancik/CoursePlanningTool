import { useEffect, useRef } from "react";
import { handleNext, handleBack } from "../components/Button/ButtonLogic";
import type { NavigateFunction } from "react-router-dom";
import saveData from "../services/processData";
import { loadCourseData } from "../utils/loadCourseData";
import { useModalFactory } from "../utils/useModalFactory"; 
import { saveAndExitHandler } from "../utils/handlers/SaveAndExitHandler";
import {previewSyllabus} from "../services/TestServices/syllabusService";
import {FormState} from "../utils/PageRenderEngine/types";
import {useCourseActions} from "./course/useCourseActions";


// Back and Next buttons call handleSave() by default

interface SyllabusWrapperLogicResult {
  modal: ReturnType<typeof useModalFactory>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleBackClick: () => void;
  handleNextClick: () => void;
  handleSave: () => void;
  handleSaveAndExit: (navigate_to:string) => void;
  handlePreviewClick: () => void;
}

export function useSyllabusWrapperLogic(
  formData: FormState,
  setFormData: React.Dispatch<React.SetStateAction<FormState>>,
  navigate: NavigateFunction,
  pathname: string
): SyllabusWrapperLogicResult {
  const modal = useModalFactory();                
  const containerRef = useRef<HTMLDivElement>(null);
  const courseID = localStorage.getItem("currentCourseId");

//Load and data Cache
  useEffect(() => {
    const cachedData = localStorage.getItem("courseData");
    
    // currently do not load cached data
    // eventually, we can compare time stamp for cached data and
    // only pull from back-end if cache is stale
    if (false || cachedData) {
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
  const handleBackClick = (save = true) => {
    if (save) handleSave();
    modal.showRedirect("Loading Previous Section", "Preparing previous section...", "loading");
    setTimeout(() => {
      handleBack(navigate, pathname, formData, courseID || undefined);
      modal.hide();
    }, 800); 
  };

  const handleNextClick = async (save = true) => {
    if (save) handleSave();
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
    handleSaveAndExit: (navigate_to: string) =>
      saveAndExitHandler({
        formData,
        containerRef: containerRef as React.RefObject<HTMLDivElement>,
        modal,
        navigate,
        navigate_to,
      }),
    handlePreviewClick: async () => {
      
      const courseDataString = localStorage.getItem("currentCourseData");
      let display_error = false;
      let courseId:string = '';
      let courseName:string = '';

      if (courseDataString !== null) {
          const courseData = JSON.parse(courseDataString); 
          courseId = courseData['course_id'];
          let num = courseData['crse_number_syllabus'] ?? '???'
          let subj = courseData['subj_code_syllabus'] ?? '???'
          courseName = subj + '_' + num
      } else {
        display_error = true;
      }
      
      if (courseId === '' || display_error) {
        modal.showRedirect('Error determining course', 'Please logout and back in again');
        return;
      }

      modal.showRedirect('Generating Syllabus', 'Generating syllabus for ' + courseName);
            
      try {
          const blob = await previewSyllabus(courseId);
          if (!blob) throw new Error("Empty preview response");

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `syllabus_preview_${courseName}.docx`;
          a.click();
          window.URL.revokeObjectURL(url);
          modal.showRedirect('Preview Ready!',`Downloaded "${courseName}".` )
          
      } catch (err: any) {
          console.error("Preview failed:", err);          
          modal.showRedirect('Error', err.message);
      } finally {
          setTimeout(() => modal.hide(), 1500);
      }

    }    
  };
}
