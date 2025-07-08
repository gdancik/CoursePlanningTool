import React from "react";
import SyllabusFormRow from "./SyllabusFormRow";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import { FaAngleUp } from "react-icons/fa";
import "./SyllabusAccordion.css";
import SafeIcon from "../../../utils/ComponentWrapper";

interface Props {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}

const SyllabusSectionAccordion: React.FC<Props> = ({
                                                       sectionName,
                                                       fields,
                                                       formData,
                                                       onFieldChange
                                                   }) => {
    return (
        <div className="syllabus-section-accordion">
            <details open>
                <summary className="syllabus-section-header">
                    <span className="syllabus-section-title">{sectionName}</span>
                    <SafeIcon Icon ={FaAngleUp} className="syllabus-section-arrow" />
                </summary>

                <div className="syllabus-section-content">
                    {fields.map((field, index) => (
                        <SyllabusFormRow
                            key={index}
                            field={field}
                            value={formData[field.content] || ""}
                            onChange={onFieldChange}
                        />
                    ))}
                </div>
            </details>
        </div>
    );
};

export default SyllabusSectionAccordion;
