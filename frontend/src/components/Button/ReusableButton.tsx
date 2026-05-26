// This file defines a reusable button component for the form with different styling options.

import React from 'react';
import './ReusableButton.css'; // Import button styles

// Define the props for the reusable button
interface ReusableButtonsProps {
    label: string;                       // Text label for the button
    onClick?: () => void;                // Optional callback for the button's click event
    type?: "button" | "submit";          // HTML button type: "button" or "submit" (default is "button")
    icon?: React.ReactNode;              // Optional icon to display before the label
    variant: "primary" | "secondary" | "green" | "exit" | "red"; // Styling variant
    className?: string;
    disabled?: boolean;                  // Optional disabled state
    externalLink?: boolean;                  // true for external icon
}

// Functional component that renders a styled button

const ReusableButton: React.FC<ReusableButtonsProps> = ({
    label,
    onClick,
    type = "button",
    icon,
    variant= "secondary",
    className="",
    externalLink = false,
    disabled = false,
}) =>{
    return(
        <button
        type = {type}
        className={`reusable-button ${variant} ${className}`}
        onClick={onClick}
        disabled={disabled}
        >
            {icon && <span className="button-icon">{icon}</span>}
            {label}
            {externalLink && <i className={"fa-solid fa-arrow-up-right-from-square"}></i>}
        </button>
    );
};

export default ReusableButton;