import React from "react";
import CheckboxGroup from "../CheckboxGroup";
import {CheckboxGroupComponent} from "../../../utils/types";

type Props = {
    component: CheckboxGroupComponent
    formData: Record<string, string>
    onChange: (label: string, value: string) => void;
};

export default function CheckboxGroupWrapper ({component, formData, onChange}: Props) {
    const fieldId = component.id || "";
    const rawValue = formData[fieldId];

    let currentValue: string[] = [];

    if(Array.isArray(rawValue)) {
        currentValue = rawValue;
    }
    else if (typeof rawValue === "string")
    {
        try
        {
         const parsed = JSON.parse(rawValue);
         if(Array.isArray(parsed)) {
             currentValue = parsed;
         }
         else
         {
             currentValue = rawValue.split(",").filter(Boolean);
         }
        }
        catch
        {
            currentValue = rawValue.split(",").filter(Boolean);
        }

    }
    return(
        <CheckboxGroup
            label={component.label}
            id = {component.id}
            data = {component.data || []}
            className = {component.className}
            horizontal={component.horizontal ?? true}
            value = {currentValue}
            onChange={(vals: string []) => onChange(fieldId, JSON.stringify(vals))}
        />
    );
}

