import React from "react";
import {FaAngleUp} from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper"
import HIPSAlert from "../../../assets/images/HIPS_Alert.png"
import HIPS_Table from "../../../assets/images/HIPS_Table.png"
import './HIPSAccordion.css'


interface Props{
    sectionName: string;
    fields: SyllabusContent[];
}

const HIPSAccordion: React.FC<Props> = ({sectionName, fields}) => {
    const sectionFields = fields.filter(f => f.section === sectionName);

    return (
        <div className="syllabus-section-accordion">
            <details open>
                <summary className="syllabus-section-header">
                    <span className="syllabus-section-title">{sectionName}</span>
                    <SafeIcon Icon={FaAngleUp} className="syllabus-section-arrow"/>
                </summary>

                <div className="content-block">
                    <img src={HIPSAlert} alt="bigger alert" className="bigger-alert"/>
                </div>

                <div className="section-split">
                    <div className="section-label">
                        <h3 className="section-heading">Write clear and measurable learning outcomes.</h3>
                        <button className="resource-button">Link to CTLA↗</button>
                    </div>

                    <div className="section-body">
                        <p className="explanation-paragraph">{sectionFields[0]?.content}</p>
                    </div>
                </div>

                    <img src={HIPS_Table} alt="HIPSTable" className="hips-table"/>

            </details>
        </div>
);
};
export default HIPSAccordion;