import React from "react";
import Checkbox from "../Checkbox";
import {FormData, FormValue, CheckboxComponent} from "../../../utils/types";
import value from "*.png";

type Props = {
    component: CheckboxComponent;
    formData: FormData;
    onChange: (fieldId: string, value: string) => void;
}

export default function CheckboxWrapper ({
    component,
    formData,
    onChange}: Props) {

    const fieldId = component.id ?? "";
    const rawValue = formData[fieldId];

    const checked = rawValue === true || rawValue === "true";

    return (
        <Checkbox
            id={fieldId}
            label={component.label}
            className={component.className}
            checked={checked}
            onChange={(checked) => onChange(fieldId, JSON.stringify(value))}
        />
    )
}