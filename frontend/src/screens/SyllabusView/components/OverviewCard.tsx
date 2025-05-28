import React from 'react';

interface Props {
    title: string;
    description: string;
    completed: boolean;
}

const OverviewCard: React.FC<Props> = ({ title, description, completed }) => {
    return(
        <div className="overview-card">
            <div className = "card-header">
                <h3>{title}</h3>
                {completed && <span className="statuse completed">Completed</span>}
            </div>
            <p className = "card-deescription">{description}</p>
        </div>
    );
};
export default OverviewCard;