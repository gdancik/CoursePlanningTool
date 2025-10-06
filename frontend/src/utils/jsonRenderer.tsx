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
    content?: JsonComponent[];
    text?: string;
    data?: string[];
    horizontal?: boolean;
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
                        <div key={i}>{jsonRenderComponent(child, formData, onChange)}</div>
                    ))}
                </SectionAccordion>
            );

        case "Row":
            return (
                <div className={`form-row`}>
                    {component.content?.map((child, i) =>
                        jsonRenderComponent(child, formData, onChange)
                    )}
                </div>
            );

        case "CheckboxGroup":
            return (
                <div className={component.className || ""}>
                    <CheckboxGroup
                        id={component.id}
                        data={component.data || []}
                        horizontal={component.horizontal ?? true}
                    />
                </div>
            );

        case "Alert":
            return <Alert text={component.text || ""} />;

        case "Information":
            return <Information text={component.text || ""} />;

        // Text-like inputs
        case "text":
        case "email":
        case "tel":
            return (
                <label key={component.id} className={component.className || ""}>
                    {component.label}
                    <input
                        id={component.id || component.label || ""}
                        type={component.type}
                        placeholder={component.placeholder}
                        value={formData[component.id || component.label || ""] || ""}
                        onChange={(e) => onChange(component.label || "", e.target.value)}
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
                        value={formData[component.id || component.label || ""] || ""}
                        onChange={(e) => onChange(component.label || "", e.target.value)}
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
                        <p className="helper-text">{component.placeholder}</p>
                    )}
                    <textarea
                        id={component.id || component.label || ""}
                        value={formData[component.id || component.label || ""] || ""}
                        onChange={(e) => onChange(component.label || "", e.target.value)}
                        required={component.required}
                        className={component.className || ""}
                    />
                </label>
            );

        default:
            return null;
    }
}
