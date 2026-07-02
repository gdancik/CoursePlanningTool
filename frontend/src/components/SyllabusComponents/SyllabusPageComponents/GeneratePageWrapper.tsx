import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSyllabusWrapperLogic } from "../../../hooks/useSyllabusWrapperLogic";
import GenerateSyllabusPage from "./GenerateSyllabusPage";
import ModalRenderer from "../../Modals/ModalRenderer";
import { JsonComponent} from "../../../utils/PageRenderEngine/types";
import { FormState, FormValue } from "../../../utils/PageRenderEngine/types";

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
    handleSaveAndNavigate,
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
            onSaveAndNavigate={handleSaveAndNavigate}
            onPreview={handlePreviewClick}
            containerRef={containerRef}
        />

        <ModalRenderer modal={modal} />
      </>
  );
};

export default GeneratePageWrapper;