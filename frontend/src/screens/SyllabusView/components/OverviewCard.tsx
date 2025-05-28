import React from 'react';
import { FaPen, FaRegSquare } from 'react-icons/fa';
import './OverviewCard.css';

//Props interface for the OverviewCard Component.
// - title: the section's title
// - description: A brief summary of the section
// - completed: Boolean indicating if a section has been completed
interface Props {
    title: string;
    description: string;
    completed: boolean;
}

//Functional component that renders a syllabus overview card
//Displays the section title, description, and action icons.
//The "Completed" status is conditionally shown based on props.

const OverviewCard: React.FC<Props> = ({ title, description, completed }) => {
    return (
        <div className="overview-card">
            {/*Section Title*/}
            <div className="card-title-area">{title}</div>

            {/* Section Description*/}
            <div className="card-description-area">{description}</div>

            {/* Action icons and completed status */}
            <div className="card-icons">
                <FaPen className="icon"/> {/*Edit Icon, NOTE: this currently is non-functional and requires a button*/}
                <FaRegSquare className="icon"/> {/*Placeholder check box icon, needs to update depending on which the user completes*/}
                {completed && <span className="status">Completed</span>}
            </div>
        </div>
    );
};

export default OverviewCard;