import React from "react";

import {TextAreaComponent, TextInputComponent, FormState} from "../../utils/types";

interface InputFormProps {
    component: TextInputComponent | TextAreaComponent;
    formData: FormState;
    onChange: (label: string, value: string) => void;
}

const wordCountLimit = {
    text: {maxLength: 100},
    textarea: {maxLength: 4000},
};

export const FormInput: React.FC<InputFormProps> = ({
    component,
    formData,
    onChange
}) => {
    const componentType =  component.type;
    const maxWordLength = wordCountLimit[component.type].maxLength;
    const fieldId = component.id || component.label || ""
    const fieldValue = formData[fieldId];
    const value =
        typeof fieldValue === "string" || typeof fieldValue === "number" ? fieldValue : "";
    return (
        <label key={fieldId} className={component.className || ""}>
            {component.label}

            {component.type === "textarea" && component.placeholder && (
                <p>{component.placeholder}</p>
            )}

            {component.type === "textarea" ? (
                <textarea
                    id={fieldId}
                    placeholder={component.placeholder}
                    value={value}
                    maxLength={maxWordLength}
                    required={component.required}
                    className={component.className || ""}
                    onChange={(e) => onChange(fieldId, e.target.value)}
                    style={{
                        overflowY: "auto",
                        resize: "vertical",
                    }}
                />
            ) : (
                <input
                    id={fieldId}
                    type="text"
                    placeholder={component.placeholder}
                    value={value}
                    maxLength={maxWordLength}
                    required={component.required}
                    className={component.className || ""}
                    onChange={(e) => onChange(fieldId, e.target.value)}
                />
            )}
        </label>
    );
};