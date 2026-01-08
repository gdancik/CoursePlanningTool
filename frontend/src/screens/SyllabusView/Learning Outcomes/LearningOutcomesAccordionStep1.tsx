import React from "react";
import { FaAngleUp } from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper";
import SyllabusFormField from "../../../components/SyllabusComponents/SyllabusFormField";
import "./LearningOutcomesAccordionStep1.css";

import AdditionalCompetenciesImage from "../../../assets/images/AdditionalCompetencies.png";
import KnowledgeTable from "../../../assets/images/Knowledge_table.png";
import SkillsTable from "../../../assets/images/Skill_table.png";
import AttitudeTable from "../../../assets/images/Attitudes_Table.png";
import BloomsImage from "../../../assets/images/blooms_taxonomy.png";

import ActionButton from "../../../components/SyllabusComponents/ActionButton"
import ContentCardSet from "../../../components/SyllabusComponents/ContentCardSet";

export interface CoreCompetencyInterface {
  icon: string;
  alt: string;
  content: string;
}; 

export const FiveCoreCompetencies = ( { five }: { five: CoreCompetencyInterface[] }) => {
        return (
            <div className="background-area">

                <h2 className="core-title">Five Core Competencies</h2>
                <div className="core-competency-row">
                {five.map( (x) => {                   
                    return (                        
                            <div className="core-competency-card">
                                <img src={x.icon} alt={x.alt} className="core-icon"/>
                                <p>{x.content}</p>
                            </div>                    
                
                    )
                }

                )}
            </div>
            </div>
        )
    }

    export const AdditionalCompetencies = () => {
        return (
            <div className="addititional-competencies">
                <h3>Additional Competencies</h3>

                <div className="competency-alert-container">
                    <img src={AdditionalCompetenciesImage} alt="Additional Competencies"
                            className="competency-alert"/>
                    <div className="competency-table-row">
                        <img src={KnowledgeTable} alt="Knowledge Table" className="competency-table"/>
                        <img src={SkillsTable} alt="Skills Table" className="competency-table"/>
                        <img src={AttitudeTable} alt="Attitudes Table" className="competency-table"/>
                    </div>
                </div>
            </div>
        )
    }


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


export const LearningOutcomesCards = ({ id }: { id: string }) => {
    return (
        <ContentCardSet
            id = {id}
            setTitle="Learning Outcomes"
            titleLabel="Learning Outcome {index} Title:"
            descriptionLabel="Learning Outcome {index} Description:"
            initialCards={[]} //[{"title": "t1", "description": "d1"}]}
            onChange = {() => {}}           
            minCards={2}
            maxCards={8}    
        />
    )
}


interface AccordionProps {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>; //
    onFieldChange: (label: string, value: string) => void;
}

export const LearningOutcomesAccordion: React.FC<AccordionProps> = ({ sectionName, fields, formData, onFieldChange }) => {
    const sectionFields = fields.filter(f => f.section === sectionName);

    console.log(sectionFields);

    const getText = (startsWith: string) =>
        sectionFields.find(f => f.content?.trim().startsWith(startsWith))?.content || "";

    const intro = getText("If your course is in the ELAC curriculum");


    const five = [
        {   
            "icon": "images/communication.png",
            "alt": "Communication",
            "content": "requires students to recognize and utilize the most appropriate means to address specific audiences in relevant context or genres in order to effectively inform or persuade."
        },
        {   
            "icon": "images/creativity.png",
            "alt": "Creativity",
            "content": "is the ability to utilize skills and strategies to synthesize ideas, perspectives, information, or materials in original and self-aware ways and to use that synthesis to generate imaginative acts or products."
        },
        {
            "icon": "images/critical_thinking.png",
            "alt": "Critical Thinking",
            "content": "is the analysis and evaluation of complex ideas, artifacts, information, and arguments as a basis for formulating a well-reasoned belief, judgement, or conclusion."
        },
        {
            "icon": "images/ethical_reasoning.png",
            "alt": "Ethical Reasoning",
            "content": "requires students to recognize ethical issues, identify their own ethical positions, and analyze other ethical perspectives in real-world situations in order to consider teh impact of decisions and actions on other individuals, society, and the environment."
        },        
        {
            "icon": "images/quantitative_literacy.png",
            "alt": "Quantitative Literacy",
            "content": "is competency in working with numerical data to reason or solve problems, the ability to make judgements and draw conclusions supported by quantitative evidence, and the ability to communicate those arguments utilizing quantitative roles."
        }

    ]

    

    

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
                 
                 <FiveCoreCompetencies five = {five}/>
                 <AdditionalCompetencies/>
                
                <div>
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

