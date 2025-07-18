import React from 'react';
import { FaPen, FaRegSquare } from 'react-icons/fa';
import {Link} from 'react-router-dom';
import SafeIcon from '../../../utils/ComponentWrapper'
import EditIcon from "../../../assets/images/EditIcon.png"
import './OverviewCard.css';


//Props interface for the OverviewCard Component.
// - title: the section's title
// - description: A brief summary of the section
// - completed: Boolean indicating if a section has been completed
interface Props {
    title: string;
    description: string;
    completed: boolean;
    link: string;
    imageSrc?: string;
}

//Functional component that renders a syllabus overview card
//Displays the section title, description, and action icons.
//The "Completed" status is conditionally shown based on props.

const OverviewCard: React.FC<Props> = ({ title, description, completed, link,imageSrc }) => {
    return (
        <div className="overview-card">
            {/*Section Title*/}
            <div className="card-title-area">{title}</div>

            <img src={imageSrc} alt ="Section Icon" className="section-icons"/>

            {/* Section Description*/}
            <div className="card-description-area">{description}</div>

            {/* Action icons and completed status */}
            <div className="card-icons">
                <Link to={link}>
                    <img src = {EditIcon} alt="EditIcon" className="Editicon"/>
                </Link>
                <SafeIcon Icon={FaRegSquare} className="icon"/>
                {completed && <span className="status">Completed</span>}
            </div>
        </div>
    );
};

export default OverviewCard;