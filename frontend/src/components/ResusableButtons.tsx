//This file contains the buttons for the form with individual styling for reusability

import React from 'react';
//Another Import here

interface ResusableButtonsProps{
    label: string;
    onClick?: () => void;
    type?: "button" | "submit";
    icon?: React.ReactNode;
    variant: "primary" | "secondary" | "green";
}

const ReusableButton: React.FC<ResusableButtonsProps> = ({
    label,
    onClick,
    type = "button",
    icon,
    variant= "back",
}) =>{
    return(
        <button
        type = {type}
        className={`reusable-button ${variant}`}
        onClick={onClick}
        >
            {icon && <span className="button-icon">{icon}</span>}
            {label}
        </button>
    );
};

export default ReusableButton;