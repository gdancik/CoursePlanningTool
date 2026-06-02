// frontend/src/components/SyllabusComponents/ComponentWrappers/OverviewWrapper.tsx

import React from "react";
import OverviewComponent from "../OverviewComponent";
import {
    FormState,
    FormValue,
    OverviewComponentType,
} from "../../../utils/types";

type OverviewWrapperProps = {
    component: OverviewComponentType;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function OverviewWrapper({
                                            formData,
                                        }: OverviewWrapperProps) {
    return <OverviewComponent formData={formData} />;
}