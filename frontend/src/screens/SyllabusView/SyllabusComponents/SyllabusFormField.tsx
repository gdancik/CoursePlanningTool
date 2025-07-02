import React from "react";
import {SyllabusContent} from "../../../utils/loadSyllabusContent";

interface Props{
    field: SyllabusContent;
    value: string;
    onChange: (label: string, value: string) => void;
}

const SyllabusFormField: React.FC<Props> = ({field, value, onChange}) => {
    const handleInputChange = (e: React.ChangeEvent <HTMLTextAreaElement>) => {
        onChange(field.content, e.target.value); // Call the onChange callback with the updated value
    };

    if (field.type === 'text-area') {
        return (
            <div>
                <p className="helper-text">{field.content}</p>
                <textarea
                    value={value}                      // Current value
                    onChange={handleInputChange}      // Handle changes
                    required={field.required}         // Mark as required if specified
                />
            </div>
        );
    }

}