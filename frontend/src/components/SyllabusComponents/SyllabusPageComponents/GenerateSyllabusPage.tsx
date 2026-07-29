import React, { useState } from "react";
import SyllabusLayout from "../../../SyllabusLayout/SyllabusPageHeader";
import GeneratePageContent from "./GeneratePageContent";
import { JsonComponent } from "../../../utils/PageRenderEngine/types";
import { FormState, FormValue } from "../../../utils/PageRenderEngine/types";
import { useModalFactory } from "../../../utils/useModalFactory";

interface GenerateSyllabusPageProps {
    json: JsonComponent[];
    formData: FormState;
    onFieldChange: (fieldId: string, value: FormValue) => void;
    onBack?: () => void;
    onNext?: () => void;
    onSave?: () => void;
    onSaveAndNavigate?: (navigateTo: string) => void | Promise<void>;
    onPreview: () => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    modal: ReturnType<typeof useModalFactory>;
}

const GenerateSyllabusPage = ({
                                  json,
                                  formData,
                                  onFieldChange,
                                  onBack,
                                  onNext,
                                  onSave,
                                  onSaveAndNavigate,
                                  onPreview,
                                  containerRef,
                                  modal,
                              }: GenerateSyllabusPageProps) => {
    const [changesDetected, setChangesDetected] = useState(false);

    const subjCode =
        typeof formData["subj_code_syllabus"] === "string"
            ? formData["subj_code_syllabus"]
            : "";

    const courseNumberValue =
        typeof formData["crse_number_syllabus"] === "string"
            ? formData["crse_number_syllabus"]
            : "";

    const term =
        typeof formData["term_syllabus"] === "string"
            ? formData["term_syllabus"]
            : "";

    const year =
        typeof formData["year_syllabus"] === "string"
            ? formData["year_syllabus"]
            : "";

    const courseNumber = `${subjCode}-${courseNumberValue} (${term} ${year})`;

    return (
        <div
            ref={containerRef}
            onInput={() => {
                setChangesDetected(true);
            }}
        >
            <SyllabusLayout
                onBack={onBack}
                onNext={onNext}
                onSave={onSave}
                onSaveAndNavigate={onSaveAndNavigate}
                onPreview={onPreview}
                changesDetected={changesDetected}
                setChangesDetected={setChangesDetected}
                courseNumber={courseNumber}
                modal={modal}
            />

            <GeneratePageContent
                json={{ content: json }}
                formData={formData}
                onFieldChange={onFieldChange}
            />
        </div>
    );
};

export default GenerateSyllabusPage;