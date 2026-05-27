import React from "react";

import {SelectComponent, FormState} from "../../utils/types";

interface DropDownComponentProps {
    component: SelectComponent;
    formData: FormState;
    onChange: (label: string, value: string) => void;
}


export const DropDownComponent: React.FC <DropDownComponentProps> = ({
    component, formData, onChange
}) => {

    const rawValue = formData[component.id];
    const valueOfSelect =  typeof rawValue === "string" || typeof rawValue === "number" ? rawValue : "";

    return (
        <label key={component.id} className={component.className || ""}>
            {component.label}
            <select
            id = {component.id}
            value = {valueOfSelect}
            onChange={(e) => {onChange(component.id, e.target.value);}}
            required = {component.required}
            className = {component.className || ""}>
                <option value="">Select</option>
                {component.options?.map((opt, i) => (
                    <option key={component.id + i} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </label>
    );
}