//This file contains the buttons for the form with individual styling for reusability

import React from 'react';
import './ReusableButton.css'
//Another Import here

interface ReusableButtonsProps{
    label: string;
    onClick?: () => void;
    type?: "button" | "submit";
    icon?: React.ReactNode;
    variant: "primary" | "secondary" | "green" | "exit";
}

const ReusableButton: React.FC<ReusableButtonsProps> = ({
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