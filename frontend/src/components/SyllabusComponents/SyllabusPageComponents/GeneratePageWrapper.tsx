import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSyllabusWrapperLogic } from "../../../hooks/useSyllabusWrapperLogic";
import { loadCourseData } from "../../../utils/loadCourseData";
import GenerateSyllabusPage from "./GenerateSyllabusPage";
import ModalRenderer from "../../Modals/ModalRenderer";
import { JsonComponent } from "../../../utils/jsonRenderer";
import { FormState, FormValue } from "../../../utils/types";

interface GeneratePageWrapperProps {
  json: JsonComponent[];
  disableBack?: boolean;
  disableNext?: boolean;
}

const GeneratePageWrapper: React.FC<GeneratePageWrapperProps> = ({
                                                                   json,
                                                                   disableBack = false,
                                                                   disableNext = false,
                                                                 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<FormState>({});

  const {
    modal,
    handleBackClick,
    handleNextClick,
    handleSave,
    handleSaveAndExit,
    handlePreviewClick,
    containerRef,
  } = useSyllabusWrapperLogic(formData, setFormData, navigate, location.pathname);

  const handleChange = (fieldId: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  return (
      <>
        <GenerateSyllabusPage
            json={json}
            formData={formData}
            onFieldChange={handleChange}
            onBack={disableBack ? undefined : handleBackClick}
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