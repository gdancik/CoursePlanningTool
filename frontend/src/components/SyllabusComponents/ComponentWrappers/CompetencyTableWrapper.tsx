// frontend/src/components/SyllabusComponents/ComponentWrappers/CompetencyTableWrapper.tsx

import React from "react";
import CompetencyTable1 from "../Tables/CompetencyTable1";
import CompetencyTable2 from "../Tables/CompetencyTable2";
import {
    CompetencyTable1Component,
    CompetencyTable2Component,
    FormState,
    FormValue,
} from "../../../utils/types";
import { parseStringMatrix } from "../../../utils/typeGuards";

type CompetencyTableComponent =
    | CompetencyTable1Component
    | CompetencyTable2Component;

type CompetencyTableWrapperProps = {
    component: CompetencyTableComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function CompetencyTableWrapper({
                                                   component,
                                                   formData,
                                               }: CompetencyTableWrapperProps) {
    const data = parseStringMatrix(formData[component.id]);

    switch (component.type) {
        case "CompetencyTable1":
            return (
                <CompetencyTable1
                    id={component.id}
                    data={data}
                />
            );

        case "CompetencyTable2":
            return (
                <CompetencyTable2
                    id={component.id}
                    data={data}
                />
            );

        default:
            return null;
    }
}