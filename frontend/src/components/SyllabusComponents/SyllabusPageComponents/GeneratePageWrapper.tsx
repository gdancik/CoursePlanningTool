import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSyllabusWrapperLogic } from "../../../hooks/useSyllabusWrapperLogic";
import { loadCourseData } from "../../../utils/loadCourseData";
import GenerateSyllabusPage from "./GenerateSyllabusPage";
import ModalRenderer from "../../Modals/ModalRenderer";
import { JsonComponent } from "../../../utils/jsonRenderer";

interface GeneratePageWrapperProps {
  json: JsonComponent[];
  disableBack?: boolean;
  disableNext?: boolean;
}

const GeneratePageWrapper: React.FC<GeneratePageWrapperProps> = ({ json, disableBack = false, disableNext = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Local page state
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // useSyllabusWrapperLogic will load course data
 let {
    modal,
    handleBackClick,
    handleNextClick,
    handleSave,
    handleSaveAndExit,
    handlePreviewClick,
    containerRef,
  } = useSyllabusWrapperLogic(formData, setFormData, navigate, location.pathname);

  // TO DO: do we need handleChange?
  // Handle input field changes
  const handleChange = (label: string, value: string) => {   
    setFormData((prev) => ({ ...prev, [label]: value }));        
  };

  return (
    <>
      <GenerateSyllabusPage
        json={json}
        formData={formData}
        onFieldChange={handleChange}
        onBack = {disableBack ? undefined : handleBackClick}
        onNext={disableNext ? undefined : handleNextClick}
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
