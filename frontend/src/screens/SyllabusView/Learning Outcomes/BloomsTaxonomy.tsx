import React from "react";
import "./BloomsTaxonomy.css"
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

