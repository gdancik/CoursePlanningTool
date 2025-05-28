import React from 'react';
import { FaPen, FaRegSquare } from 'react-icons/fa';
import './OverviewCard.css';

interface Props {
    title: string;
    description: string;
    completed: boolean;
}

const OverviewCard: React.FC<Props> = ({ title, description, completed }) => {
    return (
        <div className="overview-card">
            <div className="card-title-area">{title}</div>
            <div className="card-description-area">{description}</div>
            <div className="card-icons">
                <FaPen className="icon"/>
                <FaRegSquare className="icon"/>
                {completed && <span className="status">Completed</span>}
            </div>
        </div>
    );
};

export default OverviewCard;