// frontend/src/components/SyllabusComponents/ComponentWrappers/ChecklistWrapper.tsx

import React from "react";
import ChecklistComponent from "../ChecklistComponent";
import {
    ChecklistComponentType,
    FormState,
    FormValue,
} from "../../../utils/PageRenderEngine/types";

type ChecklistComponentWrapperProps = {
    component: ChecklistComponentType;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function ChecklistComponentWrapper({
                                             formData,
                                         }: ChecklistComponentWrapperProps) {
    return (
        <ChecklistComponent
            formData={formData}
            additional_sections_id="additional_sections_syllabus_json"
            policy_checkboxes_id="policy_checkboxes"
            resources_checkboxes_id="resources_checkboxes"
        />
    );
}