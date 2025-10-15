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
    conditionalId?: string; // ID of field that controls visibility
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
    // If row has a conditionalId and it's false, hide it
    if (component.conditionalId && !formData[component.conditionalId]) {
        return null;
    }

    return (
        <div className="form-row">
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
                value={(formData[component.id || ""] || "").split(",").filter(Boolean)}
                onChange={(vals: string[]) =>
                    onChange(component.id || "", vals.join(","))
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
                    onChange(component.id || "", e.target.checked ? "true" : "")
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
                    onChange={(e) => onChange(component.id || "", e.target.value)} 
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
                        onChange={(e) => onChange(component.id || "", e.target.value)}
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
                        onChange={(e) => onChange(component.id || "", e.target.value)}
                        required={component.required}
                        className={component.className || ""}
                    />
                </label>
            );

        default:
            return null;
    }
}
