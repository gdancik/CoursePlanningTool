import React from "react";
import "./SectionAccordion.css";
import { FaAngleUp } from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import { JsonComponent, JsonRenderComponent } from "../../utils/jsonRenderer";

interface Props {
    sectionName: string; // Name of the section (e.g., "Personal Info")
    content?: JsonComponent[]; // JSON-defined child components
    formData: Record<string, string>; // Current form data
    onFieldChange: (label: string, value: string) => void; // Callback to handle changes
    children?: React.ReactNode; // Manual override if needed
}

const SectionAccordion: React.FC<Props> = ({
                                               sectionName,
                                               content,
                                               formData,
                                               onFieldChange,
                                               children,
                                           }) => {
    return (
        <div className="section-accordion">
            {/* HTML <details> for collapsible accordion */}
            <details open>
                <summary className="section-header">
                    {/* Section title */}
                    <span className="section-title">{sectionName}</span>

                    {/* Collapse/expand icon */}
                    <SafeIcon Icon={FaAngleUp} className="section-arrow" />
                </summary>

                {/* Accordion content */}
                <div className="section-content">
                    {children
                        ? children
                        : content?.map((comp, idx) => (
                            <div key={idx}>
                                <JsonRenderComponent component = {comp} formData = {formData} onChange = {onFieldChange}/>
                            </div>
                        ))}
                </div>
            </details>
        </div>
    );
};

export default SectionAccordion;

