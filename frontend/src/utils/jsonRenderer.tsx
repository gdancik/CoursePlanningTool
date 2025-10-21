import React from "react";
import SectionAccordion from "../screens/SyllabusView/BasicInformation/SectionAccordion";
import CheckboxGroup from "../components/SyllabusComponents/CheckboxGroup";
import Alert from "../components/SyllabusComponents/Alert";
import Information from "../components/SyllabusComponents/Information";

// Type for JSON-driven UI
export type JsonComponent = {
    type: string;
    title?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    className?: string;
    informationText?: string;

    content?: JsonComponent[];
    text?: string;
    data?: string[];
    horizontal?: boolean;
    conditional?: {
        field: string;
        value?: string;
    };
};

// Recursive renderer
export function jsonRenderComponent(
    component: JsonComponent,
    formData: Record<string, string>,
    onChange: (label: string, value: string) => void
): React.ReactNode {
    switch (component.type) {
        case "Accordion":
            return (
                <SectionAccordion
                    sectionName={component.title || ""}
                    formData={formData}
                    onFieldChange={onChange}
                >
                    {component.content?.map((child, i) => (
                        <div key={i}>
                            {jsonRenderComponent(child, formData, onChange)}
                        </div>
                    ))}
                </SectionAccordion>
            );

        case "Column":
            if (component.conditional) {
                const fieldValue = formData[component.conditional.field];
                const requiredValue = component.conditional.value;

            
                if (requiredValue === undefined) {
                    if (!fieldValue) return null;
                } else {
                    if (fieldValue !== requiredValue) return null;
                }
            }

            return (
            <div 
            key={component.id} 
            className={component.className || "form-column"}
            >
                    {component.content?.map((child, i) =>
                        jsonRenderComponent(child, formData, onChange)
                    )}
                </div>
            );

        case "Row":
            // Handle conditional logic for rows
            if (component.conditional) {
                const fieldValue = formData[component.conditional.field];
                const requiredValue = component.conditional.value;

                // If no specific value is required, just check truthiness
                if (requiredValue === undefined) {
                    if (!fieldValue) return null;
                } else {
                    if (fieldValue !== requiredValue) return null;
                }
            }

            return (
            <div key={component.id} className={component.className || "form-row"}>
                    {component.content?.map((child, i) =>
                        jsonRenderComponent(child, formData, onChange)
                    )}
                </div>
            );

        case "CheckboxGroup":

        const fieldId = component.id || "";


        const currentValue = (formData[component.id || ""] || "")
        .split(",")
        .filter(Boolean);
            return (
                <div key={component.id } className={component.className || ""}>
                    <CheckboxGroup
                        id={component.id}
                        data={component.data || []}
                        horizontal={component.horizontal ?? true}
                        label={component.label}
                        value={currentValue}
                        onChange={(vals: string[]) =>
                            onChange(fieldId, vals.join(","))
                        }
                    />
                </div>
            );

        case "checkbox":
            return (
                <label className={component.className || ""}>
                    <input
                        type="checkbox"
                        id={component.id}
                        checked={!!formData[component.id || ""]}
                        onChange={(e) =>
                            onChange(
                                component.id || "",
                                e.target.checked ? "true" : ""
                            )
                        }
                    />
                    {component.label}
                </label>
            );

        case "Alert":
            return <Alert text={component.text || ""} />;

        case "Information":
            return <Information text={component.text || ""} />;

        // Text-like inputs

        case "text":
            return (
                <label key={component.id} className={component.className || ""}>
                    {component.label}
                    <input
                        id={component.id || component.label || ""}
                        type={component.type}
                        placeholder={component.placeholder}
                        value={
                            formData[component.id || component.label || ""] ||
                            ""
                        }
                        onChange={(e) =>
                            onChange(component.id || "", e.target.value)
                        }
                        required={component.required}
                        className={component.className || ""}
                    />
                </label>
            );

        // Dropdown
        case "select":
            return (
                <label key={component.id} className={component.className || ""}>
                    {component.label}
                    <select
                        id={component.id || component.label || ""}
                        value={
                            formData[component.id || component.label || ""] ||
                            ""
                        }
                        onChange={(e) =>
                            onChange(component.id || "", e.target.value)
                        }
                        required={component.required}
                        className={component.className || ""}
                    >
                        <option value="">Select</option>
                        {component.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </label>
            );

        // Textarea
        case "textarea":
            return (
                <label key={component.id} className={component.className || ""}>
                    {component.label}
                    {component.placeholder && (
                        <p>
                            {component.placeholder}
                        </p>
                    )}
                    <textarea
                        id={component.id || component.label || ""}
                        value={
                            formData[component.id || component.label || ""] ||
                            ""
                        }
                        onChange={(e) =>
                            onChange(component.id || "", e.target.value)
                        }
                        required={component.required}
                        className={component.className || ""}
                    />
                </label>
            );

            case "informationText":
                return (
                    <p key={component.id} >{component.placeholder}</p>

                );

        default:
            return null;
    }
}
export default jsonRenderComponent;
