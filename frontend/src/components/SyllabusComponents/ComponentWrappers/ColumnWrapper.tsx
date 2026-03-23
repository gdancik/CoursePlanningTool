import React from "react";
import {JsonRenderComponent} from "../../../utils/jsonRenderer";
import {ColumnComponent} from "../../../utils/types";

type Props = {
    component: ColumnComponent;
    formData: Record<string, string>;
    onChange: (label: string, value: string) => void;
};

export default function ColumnWrapper({component, formData, onChange}: Props) {
    if (component.conditional) {
        const fieldValue = formData[component.conditional.field];
        const requiredValue = component.conditional.value;

        if (requiredValue == undefined) {
            if(!fieldValue) return null;
        }
        else
        {
            if (fieldValue !== requiredValue) return null;
        }
    }
    return (
        <div
        key = {component.id}
        className={component.className || "form-column"}
        >
            {component.content?.map ((child, i) =>
            <JsonRenderComponent  component = {child} formData={formData} onChange = {onChange} />
                )}
        </div>
    )

}