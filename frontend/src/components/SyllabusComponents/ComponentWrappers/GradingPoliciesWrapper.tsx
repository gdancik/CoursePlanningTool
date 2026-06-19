import React from "react";
import GradingPolicies from "../GradingPolicies";
import {
    FormState,
    FormValue,
    GradingPoliciesComponent,
} from "../../../utils/PageRenderEngine/types";
import { parseCardDataArray } from "../../../utils/PageRenderEngine/typeGuards";

type GradingPoliciesWrapperProps = {
    component: GradingPoliciesComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function GradingPoliciesWrapper({
                                                   component,
                                                   formData,
                                               }: GradingPoliciesWrapperProps) {
    const data = parseCardDataArray(formData[component.id]) ?? [];

    return (
        <GradingPolicies
            id={component.id}
            data={data}
        />
    );
}