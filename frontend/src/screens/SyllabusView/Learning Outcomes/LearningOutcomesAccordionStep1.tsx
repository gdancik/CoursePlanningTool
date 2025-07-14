import React from "react";
import { FaAngleUp } from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper";
import SyllabusFormField from "../SyllabusComponents/SyllabusFormField";
import "./LearningOutcomesAccordionStep1.css";

import CommunicationIcon from "../../../assets/images/communication.png";
import AdditionalCompetencies from "../../../assets/images/AdditionalCompetencies.png";
import KnowledgeTable from "../../../assets/images/Knowledge_table.png";
import SkillsTable from "../../../assets/images/Skill_table.png";
import AttitudeTable from "../../../assets/images/Attitudes_Table.png";
import CreativityIcon from "../../../assets/images/creativity.png";
import CriticalThinkingIcon from "../../../assets/images/critical_thinking.png";
import EthicalReasoningIcon from "../../../assets/images/ethical_reasoning.png";
import QuantitativeIcon from "../../../assets/images/quantitative_literacy.png";

interface Props {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>; //
    onFieldChange: (label: string, value: string) => void;
}

const LearningOutcomesAccordion: React.FC<Props> = ({ sectionName, fields, formData, onFieldChange }) => {
    const sectionFields = fields.filter(f => f.section === sectionName);

    const getText = (startsWith: string) =>
        sectionFields.find(f => f.content?.trim().startsWith(startsWith))?.content || "";

    const intro = getText("If your course is in the ELAC curriculum");

    return (
        <div className="syllabus-section-accordion">
            <details open>
                <summary className="syllabus-section-header">
                    <span className="syllabus-section-title">{sectionName}</span>
                    <SafeIcon Icon={FaAngleUp} className="syllabus-section-arrow" />
                </summary>

                <div className="syllabus-section-content">
                    {/* Intro paragraph */}
                    {intro && <p className="intro-paragraph">{intro}</p>}

                    <h2 className="core-title">Five Core Competencies</h2>

                    <div className="core-competency-row">
                        <div className="core-competency-card">
                            <img src={CommunicationIcon} alt="Communication" className="core-icon"/>
                            <h4 className="competency-label communication">communication</h4>
                            <p>{getText("requires students to recognize and utilize")}</p>
                        </div>

                        <div className="core-competency-card">
                            <img src={CreativityIcon} alt="Creativity" className="core-icon"/>
                            <h4 className="competency-label creativity">creativity</h4>
                            <p>{getText("is the ability to utilize skills and strategies")}</p>
                        </div>

                        <div className="core-competency-card">
                            <img src={CriticalThinkingIcon} alt="Critical Thinking" className="core-icon"/>
                            <h4 className="competency-label critical-thinking">critical thinking</h4>
                            <p>{getText("is the analysis and evaluation of complex ideas")}</p>
                        </div>

                        <div className="core-competency-card">
                            <img src={EthicalReasoningIcon} alt="Ethical Reasoning" className="core-icon"/>
                            <h4 className="competency-label ethical-reasoning">ethical reasoning</h4>
                            <p>{getText("requires students to recognize ethical issues")}</p>
                        </div>

                        <div className="core-competency-card">
                            <img src={QuantitativeIcon} alt="Quantitative Literacy" className="core-icon"/>
                            <h4 className="competency-label quantitative-literacy">quantitative literacy</h4>
                            <p>{getText("is competency in working with numerical data")}</p>
                        </div>
                    </div>
                    <div className="addititional-competencies">
                        <h3>Additional Competencies</h3>
                        <img src={AdditionalCompetencies} alt="Additional Competencies"
                             className="comptencies-alert"/>
                        <img src={KnowledgeTable} alt="Knowledge Table" className="knowledge-table"/>
                        <img src={SkillsTable} alt="Skills Table" className="skill-table"/>
                        <img src={AttitudeTable} alt="Attitudes Table" className="attitudes-table"/>

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
                </div>
            </details>
        </div>
    );
};

export default LearningOutcomesAccordion;
