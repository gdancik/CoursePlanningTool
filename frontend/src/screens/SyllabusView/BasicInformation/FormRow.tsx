// This component represents a row in a form, containing a label and input (or other field type).

import React from 'react';
import FormField from "./FormField";                        // Import the reusable FormField component
import { BasicInfoData } from "../../../utils/loadBasicInfoFields"; // Type for form field data
import { generateRowIdentifiers } from "../../../utils/generateRowIdentifiers"; // Utility for row identifier classes

interface Props {
    field: BasicInfoData;                                  // The field configuration
    value: string;                                         // Current value of the field
    onChange: (name: string, value: string) => void;       // Callback to update the form data
    className?: string;                                    // Optional additional CSS class for styling
}

const FormRow: React.FC<Props> = ({ field, value, onChange, className }) => {
    // Generate a unique CSS class for this row based on the field label
    const rowIdentifier = generateRowIdentifiers(field.label);

    return (
        <div className={`form-row ${rowIdentifier} ${className || ''}`}>
            {/* Render the FormField component with the passed props */}
            <FormField field={field} value={value} onChange={onChange} />
        </div>
    );
};

export default FormRow; // Export the component for use elsewhere
