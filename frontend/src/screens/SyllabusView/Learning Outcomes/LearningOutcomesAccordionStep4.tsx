import React from "react";
import { FaAngleUp } from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SyllabusFormField from "../SyllabusComponents/SyllabusFormField";
import SafeIcon from "../../../utils/ComponentWrapper";

interface Props {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}

const LearningOutcomesAccordionStep4: React.FC<Props> = ({
                                                             sectionName,
                                                             fields,
                                                             formData,
                                                             onFieldChange
                                                         }) => {
    const sectionFields = fields.filter(f => f.section === sectionName);

    return (
        <div className="syllabus-section-accordion">
            <details open>
                <summary className="syllabus-section-header">
                    <span className="syllabus-section-title">{sectionName}</span>
                    <SafeIcon Icon={FaAngleUp} className="syllabus-section-arrow" />
                </summary>

                <div className="syllabus-section-content">
                    {sectionFields.map((field, index) => (
                        <SyllabusFormField
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

export default LearningOutcomesAccordionStep4;
