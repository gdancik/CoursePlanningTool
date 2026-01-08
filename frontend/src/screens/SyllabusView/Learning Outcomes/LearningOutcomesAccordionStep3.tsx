import React from "react";
import { FaAngleUp } from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper";
import SyllabusFormField from "../../../components/SyllabusComponents/SyllabusFormField";
import AlertImage from "../../../assets/images/Writing_Alert.png"

import WritingTable from "../../../assets/images/WritingTable.png"
import "./LearningOutcomesAccordionStep3.css"
import CompetencyTable2 from "../../../components/SyllabusComponents/Tables/CompetencyTable2";
//import BloomsTaxonomy from "./LearningOutcomesAccordionStep1"
import BloomsImage from "../../../assets/images/blooms_taxonomy.png";
import ActionButton from "../../../components/SyllabusComponents/ActionButton"

export const BloomsTaxonomy: React.FC = () => {
    return (
        <div className="content-block blooms-layout">
        <div className="blooms-text">
            <h3 className="section-heading">Bloom’s taxonomy</h3>            
            <p className="explanation-paragraph">
                Bloom’s taxonomy provides a foundational framework for generating these 
                elements of the course learning outcomes. Bloom categorizes six major categories
                of thinking. The categories are ordered by the level of cognition required 
                for the process. Lower-order processes are at the bottom of the pyramid and 
                higher order processes are at the top. As you plan your learning outcomes 
                you will want to consider the course level and your expectations for what 
                students know coming into the course (which you considered in Step One above).
            </p>
            <p className="explanation-paragraph">
                Once you decide what cognitive processes you expect students to 
                engage in you can identify observable actions that students can 
                take to demonstrate each process. For example, you cannot observe 
                someone understanding something unless they explain it to you. 
                Some examples of observable verbs connected to Bloom’s categories 
                of thinking can be found in the table below:
            </p>            
        </div>

        <div className="blooms-image-wrapper">
            <img src={BloomsImage} alt="Bloom's Taxonomy Pyramid" className="blooms-pyramid"/>
        </div>

        <ActionButton label = "Examples of Observable Verbs (NEED LINK)" 
                      className = "resource-button"
                      externalLink = {true}
        />        
        </div>
    )
}

interface AccordionProps {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}



const LearningOutcomesAccordionStep3: React.FC<AccordionProps> = ({ sectionName, fields, formData, onFieldChange }) => {
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
                        <div className="section-label-LO">
                            <h3 className="section-heading-LO-top">Write clear and measurable learning outcomes.</h3>
                        </div>

                        {/* Right column: text + image/table */}
                        <div className="section-body">
                            <p className="explanation-paragraph">{sectionFields[0]?.content}</p>
                            <img src={WritingTable} alt="Writing Table" className="writing-table"/>
                        </div>
                    </div>

                    <div className="section-split">
                        <div className="section-label-LO">
                            <h3 className="section-heading-LO">Consider who is doing the learning in your course.</h3>
                        </div>

                        <div className="section-body">
                            <p className="explanation-paragraph">{sectionFields[1]?.content}</p>
                        </div>
                    </div>

                    <BloomsTaxonomy/>


                    <div className="section-split">
                        {/* LEFT SIDE: Header */}
                        <div className="section-label">
                            <h3 className="section-heading-LO">Connect ELAC Competencies with learning outcomes.</h3>
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
                    <CompetencyTable2 id={'lo_competencies2_list'}/>
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
