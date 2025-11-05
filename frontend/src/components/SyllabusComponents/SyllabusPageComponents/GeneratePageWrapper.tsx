import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSyllabusWrapperLogic } from "../../../hooks/useSyllabusWrapperLogic";
import { loadCourseData } from "../../../utils/loadCourseData";
import GenerateSyllabusPage from "./GenerateSyllabusPage";
import ModalRenderer from "../../Modals/ModalRenderer";
import { JsonComponent } from "../../../utils/jsonRenderer";

interface GeneratePageWrapperProps {
  json: JsonComponent[];
}

const GeneratePageWrapper: React.FC<GeneratePageWrapperProps> = ({ json }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Local page state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    modal,
    handleBackClick,
    handleNextClick,
    handleSave,
    handleSaveAndExit,
    handlePreviewClick,
    containerRef,
  } = useSyllabusWrapperLogic(formData, setFormData, navigate, location.pathname);

  // Load course data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const cached = localStorage.getItem("courseData");
      if (cached) {
        try {
          setFormData(JSON.parse(cached));
        } catch {
          console.warn("Invalid cached course data.");
        }
      }

      try {
        const { courseId, formData: newData } = await loadCourseData();
        setCourseId(courseId);
        setFormData(newData);
        localStorage.setItem("courseData", JSON.stringify(newData));
        modal.hide();
      } catch (err: any) {
        console.error("Error loading course data:", err);
        modal.showError(err.message || "Unable to load course data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  // Handle input field changes
  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  //ShowModal
  useEffect (() =>{
    if (isLoading) {
    modal.showRedirect("Loading Data", "Fetching course information...", "loading");
  } else {
    modal.hide ()
  }
}, [isLoading]);

  return (
    <>
      <GenerateSyllabusPage
        json={json}
        formData={formData}
        onFieldChange={handleChange}
        onBack={handleBackClick}
        onNext={handleNextClick}
        onSave={handleSave}
        onSaveAndExit={handleSaveAndExit}
        onPreview={handlePreviewClick}
        containerRef={containerRef}
      />

      <ModalRenderer modal={modal} />
    </>
  );
};

export default GeneratePageWrapper;
