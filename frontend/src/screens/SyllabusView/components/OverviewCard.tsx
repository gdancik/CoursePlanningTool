import React from 'react';
import {FaPen, FaRegSquare} from 'react-icons/fa';
import './OverviewCard.css';

interface Props {
    title: string;
    description: string;
    completed: boolean;
}

const OverviewCard: React.FC<Props> = ({ title, description, completed }) => {
    return(
        <div className="overview-card">
            <div className = "card-left">
                <div className="card-title">{title}</div>
                <div className="card-description">{description}</div>
            </div>
            <div className="card-right">
                <FaPen className="icon"/>
                <FaRegSquare className="icon"/>
                {completed && <span className="status">Completed</span>}
            </div>
        </div>
    );
};
export default OverviewCard;