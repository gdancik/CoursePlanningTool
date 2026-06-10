import React from "react";
import CheckboxGroup from "../CheckboxGroup";
import {CheckboxGroupComponent, FormState, FormValue} from "../../../utils/types";

type Props = {
    component: CheckboxGroupComponent;
    formData: FormState;
    onChange: (label: string, value: FormValue) => void;
}

function stringArrayCheck(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

export default function CheckboxGroupWrapper({ component, formData, onChange }: Props) {
    const fieldId = component.id || "";
    const rawValue = formData[fieldId];

    let currentValue: string[] = [];

    if (stringArrayCheck(rawValue)) {
        currentValue = rawValue;
    } else if (typeof rawValue === "string") {
        try {
            const parsed: unknown = JSON.parse(rawValue);

            if (stringArrayCheck(parsed)) {
                currentValue = parsed;
            } else {
                currentValue = rawValue.split(",").map(v => v.trim()).filter(Boolean);
            }
        } catch {
            currentValue = rawValue.split(",").map(v => v.trim()).filter(Boolean);
        }
    }

    return (
        <CheckboxGroup
            label={component.label}
            id={component.id}
            data={component.data || []}
            className={component.className}
            horizontal={component.horizontal ?? true}
            value={currentValue}
            onChange={(vals: string[]) => onChange(fieldId, JSON.stringify(vals))}
        />
    );
}