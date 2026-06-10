// frontend/src/components/SyllabusComponents/ComponentWrappers/AssignmentsAdapter.tsx

import React from "react";
import Assignments from "../Assignments";
import {
    AssignmentsComponent,
    FormState,
    FormValue,
} from "../../../utils/types";
import { parseCardDataArray } from "../../../utils/typeGuards";

type AssignmentsWrapperProps = {
    component: AssignmentsComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function AssignmentsWrapper({
                                               component,
                                               formData,
                                           }: AssignmentsWrapperProps) {
    const data = parseCardDataArray(formData[component.id]) ?? [];

    return (
        <Assignments
            id={component.id}
            data={data}
        />
    );
}