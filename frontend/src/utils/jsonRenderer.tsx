import React from "react";
import FormField from "../screens/SyllabusView/BasicInformation/FormField";
import { BasicInfoData } from "./loadBasicInfoFields";
import SectionAccordion from "../screens/SyllabusView/BasicInformation/SectionAccordion";
import CheckboxGroup from "../components/SyllabusComponents/CheckboxGroup";
import Alert from "../components/SyllabusComponents/Alert";
import Information from "../components/SyllabusComponents/Information";

// Type guard for form fields vs container components
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
    data?:string[];
    horizontal?:boolean;
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
                    fields={[]}
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
                <div className="form-row">
                    {component.content?.map((child, i) =>
                        jsonRenderComponent(child, formData, onChange)
                    )}
                </div>
            );

        case "CheckboxGroup":
            return(
                <CheckboxGroup
                    id={component.id}
                    data ={component.data || []}
                    horizontal={component.horizontal ?? true}

                    />
            );
        case "Alert":
            return <Alert text ={component.text || "" }/>;
        case "Information":
            return <Information text={component.text || ""}/>;

        case "text":
        case "select":
        case "textarea":
        case "email":
        case "tel":
            const field: BasicInfoData = {
                section: component.title || "",
                row: 0,
                layoutRow: 0,
                label: component.label || "",
                type: component.type,
                placeholder: component.placeholder || "",
                required: component.required ?? false,
                options: component.options || [],
            };
            return (
                <FormField
                    key={component.id}
                    field={field}
                    value={formData[field.label] || ""}
                    onChange={onChange}
                />
            );
        default:
            return null;
    }
}
