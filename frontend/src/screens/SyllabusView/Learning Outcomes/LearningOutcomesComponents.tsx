import React, {useState, useEffect} from "react";
import { FaAngleUp } from "react-icons/fa";
import SafeIcon from "../../../utils/ComponentWrapper";
import SyllabusFormField from "../../../components/SyllabusComponents/SyllabusFormField";
import {CardData, ContentCardSet} from "../../../components/SyllabusComponents/ContentCardSet";
import "./LearningOutcomesComponents.css";

import AdditionalCompetenciesImage from "../../../assets/images/AdditionalCompetencies.png";
import KnowledgeTable from "../../../assets/images/Knowledge_table.png";
import SkillsTable from "../../../assets/images/Skill_table.png";
import AttitudeTable from "../../../assets/images/Attitudes_Table.png";

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
                            <div  key = {x.alt} className="core-competency-card">
                                <img src={x.icon} alt={x.alt} className="core-icon"/>
                                <p>{x.content}</p>
                            </div>                    
                
                    )}
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
                    <img
                        src={AdditionalCompetenciesImage}
                        alt="Additional Competencies"
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


export const LearningOutcomesCards = ({ id, data = [],}: { id: string, data?:CardData[] }) => {


    return (
        <ContentCardSet
            id = {id}
            setTitle="Learning Outcomes"
            setPreface = "Upon completing this course, you will be able to:"
            titleLabel="Learning Outcome {index}"
            separateLabel = {true}
            descriptionLabel=""
            initialCards={data} //[{"title": "t1", "description": "d1"}]}
            onChange = {() => {}}
            minCards={2}
            maxCards={8}
            titlePlaceholder = "Enter learning outcome title or abbreviation"    
        />
    )
}

