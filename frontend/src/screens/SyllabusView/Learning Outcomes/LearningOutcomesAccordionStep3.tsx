import React from "react";
import { FaAngleUp } from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper";
import SyllabusFormField from "../SyllabusComponents/SyllabusFormField";
import AlertImage from "../../../assets/images/Writing_Alert.png"
import BloomsImage from "../../../assets/images/blooms_taxonomy.png";
import WritingTable from "../../../assets/images/WritingTable.png"
import "./LearningOutcomesAccordionStep3.css"

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
                    <SafeIcon Icon={FaAngleUp} className="syllabus-section-arrow"/>
                </summary>

                <div className="content-block">
                    <img src={AlertImage} alt="bigger alert" className="bigger-alert"/>
                </div>

                <div className="syllabus-section-content">
                    <div className="section-split">
                        {/* Left column: heading only */}
                        <div className="section-label">
                            <h3 className="section-heading">Write clear and measurable learning outcomes.</h3>
                        </div>

                        {/* Right column: text + image/table */}
                        <div className="section-body">
                            <p className="explanation-paragraph">{sectionFields[0]?.content}</p>
                            <img src={WritingTable} alt="Writing Table" className="writing-table"/>
                        </div>
                    </div>

                    <div className="section-split">
                        <div className="section-label">
                            <h3 className="section-heading">Consider who is doing the learning in your course.</h3>
                        </div>

                        <div className="section-body">
                            <p className="explanation-paragraph">{sectionFields[1]?.content}</p>
                        </div>
                    </div>

                    <div className="content-block blooms-layout">
                        <div className="blooms-text">
                            <h3 className="section-heading">Bloom’s taxonomy</h3>
                            {sectionFields.slice(2, 4).map((f, i) => (
                                <p key={i} className="explanation-paragraph">{f.content}</p>
                            ))}
                        </div>

                        <div className="blooms-image-wrapper">
                            <img src={BloomsImage} alt="Bloom's Taxonomy Pyramid" className="blooms-pyramid"/>
                        </div>

                        <div className="resource-buttons">
                            <button className="resource-button">Examples of Observable Verbs ↗</button>
                        </div>

                    </div>


                    <div className="section-split">
                        {/* LEFT SIDE: Header */}
                        <div className="section-label">
                            <h3 className="section-heading">Connect ELAC Competencies with learning outcomes.</h3>
                        </div>

                        {/* RIGHT SIDE: Paragraph + Buttons */}
                        <div className="section-body">
                            <p className="explanation-paragraph">{sectionFields[4]?.content}</p>
                            <div className="resource-buttons">
                                <button className="resource-button">ELAC Competencies Examples ↗</button>
                                <button className="resource-button">Additional Resources ↗</button>
                            </div>
                        </div>
                    </div>
                    {sectionFields.filter(f => f.type === "text-box").map((f, i) => (
                        <div className="content-block" key={i}>
                            <SyllabusFormField
                                field={f}
                                value={formData[f.content] || ""}
                                onChange={onFieldChange}
                            />
                        </div>
                    ))}

                </div>
            </details>
        </div>
    );
};

export default LearningOutcomesAccordionStep3;
