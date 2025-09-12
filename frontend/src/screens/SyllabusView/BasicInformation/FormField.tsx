// This component dynamically renders different types of form fields (text, select, textarea, checkboxes) based on the provided field configuration.

import React from 'react';
import { BasicInfoData } from '../../../utils/loadBasicInfoFields';

interface Props {
    field: BasicInfoData;                             // Field configuration data (type, label, etc.)
    value: string;                                    // Current value of the field
    onChange: (label: string, value: string) => void; // Callback to update the form data
}


const FormField: React.FC<Props> = ({ field, value, onChange }) => {
    // Handles input changes for text, select, and textarea fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        onChange(field.label, e.target.value); // Call the onChange callback with the updated value
    };

    // If the field is a dropdown (select)
    if (field.type === 'select' && field.options) {
        return (
            <label>
                {field.label}
                <select
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                >
                    <option value="">Select</option>
                    {field.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                    ))}
                </select>
            </label>
        );
    }

    // If the field is a textarea
    if (field.type === 'textarea') {
        return (
            <label>
                {field.label}
                <p className="helper-text">{field.placeholder}</p> {/* Placeholder text as helper text */}
                <textarea
                    value={value}                      // Current value
                    onChange={handleInputChange}      // Handle changes
                    required={field.required}         // Mark as required if specified
                />
            </label>
        );
    }

    // If the field is a checkbox group
    if (field.type === 'checkbox-group' && field.options) {
        return (
            <div className="checkbox-group">
                <label>{field.label}</label>
                <div className="checkbox-options">
                    {field.options.map((day, idx) => (
                        <label key={idx}>
                            <input
                                type="checkbox"
                                checked={value.includes(day)}      // Check if the option is currently selected
                                value={day}
                                onChange={(e) => {                 // Handle checkbox toggles
                                    const isChecked = e.target.checked;
                                    let updatedValue = value.split(',').filter(Boolean);
                                    if (isChecked) {
                                        updatedValue.push(day);     // Add the checked option
                                    } else {
                                        updatedValue = updatedValue.filter((v) => v !== day); // Remove unchecked option
                                    }
                                    onChange(field.label, updatedValue.join(',')); // Update value as comma-separated string
                                }}
                            />
                            {day}
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    // Default to a text input (or other type as specified)
    return (
        <label>
            {field.label}
            <input
                type={field.type}                      // Input type (e.g., "text", "number")
                placeholder={field.placeholder}        // Placeholder text
                value={value}                          // Current value
                onChange={handleInputChange}           // Handle changes
                required={field.required}              // Mark as required if specified
            />
        </label>
    );
};



export default FormField;
