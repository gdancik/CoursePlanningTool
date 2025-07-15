// This file defines a reusable button component for the form with different styling options.

import React from 'react';
import './ReusableButton.css'; // Import button styles

// Define the props for the reusable button
interface ReusableButtonsProps {
    label: string;                       // Text label for the button
    onClick?: () => void;                // Optional callback for the button's click event
    type?: "button" | "submit";          // HTML button type: "button" or "submit" (default is "button")
    icon?: React.ReactNode;              // Optional icon to display before the label
    variant: "primary" | "secondary" | "green" | "exit"; // Styling variant
    className?: string;
}

// Functional component that renders a styled button

const ReusableButton: React.FC<ReusableButtonsProps> = ({
    label,
    onClick,
    type = "button",
    icon,
    variant= "secondary",
    className="",
}) =>{
    return(
        <button
        type = {type}
        className={`reusable-button ${variant} ${className}`}
        onClick={onClick}
        >
            {icon && <span className="button-icon">{icon}</span>}
            {label}
        </button>
    );
};

export default ReusableButton;