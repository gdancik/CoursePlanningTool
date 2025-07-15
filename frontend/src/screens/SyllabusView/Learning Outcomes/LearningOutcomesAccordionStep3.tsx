import React from "react";
import { FaAngleUp } from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper";
import SyllabusFormField from "../SyllabusComponents/SyllabusFormField";
import AlertImage from "../../../assets/images/Writing_Alert.png"
import BloomsImage from "../../../assets/images/blooms_taxonomy.png";
import WritingTable from "../../../assets/images/WritingTable.png"


interface Props {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}

const LearningOutcomesAccordionStep3: React.FC<Props> = ({ sectionName, fields, formData, onFieldChange }) => {
    const sectionFields = fields.filter(f => f.section === sectionName);

    return (
        <div className="syllabus-section-accordion">
            <details open>
                <summary className="syllabus-section-header">
                    <span className="syllabus-section-title">{sectionName}</span>
                    <SafeIcon Icon={FaAngleUp} className="syllabus-section-arrow" />
                </summary>

                <img
                    src ={AlertImage}
                    alt = "bigger alert"
                    className="bigger-alert"
                />

                <div className="syllabus-section-content">
                    {/* SECTION: Write clear and measurable learning outcomes */}
                    <h3 className="section-heading">Write clear and measurable learning outcomes.</h3>
                    {sectionFields[0] && (
                        <p className="explanation-paragraph">{sectionFields[0].content}</p>
                    )}

                    {/* Table of Elements */}
                    <div className="elements-table">
                      <img
                          src= {WritingTable}
                          alt="Writing Table"
                          className="writing-table"
                      />
                    </div>

                    {/* SECTION: Consider who is doing the learning */}
                    <h3 className="section-heading">Consider who is doing the learning in your course.</h3>
                    {sectionFields[1] && (
                        <p className="explanation-paragraph">{sectionFields[1].content}</p>
                    )}

                    {/* SECTION: Bloom's taxonomy */}
                    <h3 className="section-heading">Bloom’s taxonomy</h3>
                    {sectionFields.slice(2, 4).map((f, i) => (
                        <p key={i} className="explanation-paragraph">{f.content}</p>
                    ))}
                    <div className="blooms-section">
                        <img src={BloomsImage} alt="Bloom's Taxonomy Pyramid" className="blooms-pyramid" />
                    </div>

                    {/* Resource Buttons */}
                    <div className="resource-buttons">
                        <button className="resource-button">Examples of Observable Verbs ↗</button>
                    </div>

                    {/* SECTION: Connect ELAC competencies */}
                    <h3 className="section-heading">Connect ELAC Competencies with learning outcomes.</h3>
                    {sectionFields[4] && (
                        <p className="explanation-paragraph">{sectionFields[4].content}</p>
                    )}

                    <div className="resource-buttons">
                        <button className="resource-button">ELAC Competencies Examples ↗</button>
                        <button className="resource-button">Additional Resources ↗</button>
                    </div>

                    {/* Form fields */}
                    {sectionFields
                        .filter((f) => f.type === "text-box")
                        .map((f, i) => (
                            <SyllabusFormField
                                key={i}
                                field={f}
                                value={formData[f.content] || ""}
                                onChange={onFieldChange}
                            />
                        ))}
                </div>
            </details>
        </div>
    );
};

export default LearningOutcomesAccordionStep3;
