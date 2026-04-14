import React from "react";
import {JsonRenderComponent} from "../../../utils/jsonRenderer";
import {RowComponent} from "../../../utils/types";

type Props = {
    component: RowComponent;
    formData: Record<string, string>;
    onChange: (label: string, value: string) => void;
};

export default function RowWrapper({component, formData, onChange}: Props) {

    // Handle conditional logic for rows
    if (component.conditional) {
        const fieldValue = formData[component.conditional.field];
        const requiredValue = component.conditional.value;

        //if no specific value is required, check for truthfulness
        if (requiredValue === undefined) {
            if(!fieldValue) return null;
        } else {
            if (fieldValue != requiredValue) return null;
        }
    }
    return (
        <div key = {component.id} className={component.className || "form-row"}>
            {component.content?.map((child, i) =>
            <JsonRenderComponent component={child} formData={formData} onChange={onChange} />
            )}

        </div>
    )
}