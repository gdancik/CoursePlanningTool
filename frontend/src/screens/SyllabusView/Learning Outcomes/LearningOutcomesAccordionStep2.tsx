import React from "react";
import { FaAngleUp, FaArrowRight } from "react-icons/fa";
import ContentTable from "../../../components/SyllabusComponents/Tables/CompetencyTable1"
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper";
import './LearningOutcomesAccordionStep2.css'

interface Props {
    sectionName: string;
    fields: SyllabusContent[];
}

const Step2Accordion: React.FC<Props> = ({ sectionName, fields }) => {
    const getByIndex = (index: number) => fields[index]?.content || "";

    return (
        <div className="syllabus-section-accordion">
            <details open>
                <summary className="syllabus-section-header">
                    <span className="syllabus-section-title">{sectionName}</span>
                    <SafeIcon Icon={FaAngleUp} className="syllabus-section-arrow" />
                </summary>

                <div className="syllabus-section-content">
                    <h3 className="step2-highlight">{getByIndex(0)}</h3>

                    <div className="step2-info-box">
                        <p>{getByIndex(1)}</p>
                        <button className="step2-button">
                            Purpose and Application Examples
                            <SafeIcon Icon = {FaArrowRight} className="step2-arrow" />
                        </button>
                    </div>

                    <p className="step2-description">{getByIndex(2)}</p>
                    <ContentTable/>
                </div>
            </details>
        </div>
    );
};

export default Step2Accordion;