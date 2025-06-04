import React from 'react';
import { BasicInfoData } from '../../../utils/loadBasicInfoFields';

interface Props {
    field: BasicInfoData;
    value: string;
    onChange: (label: string, value: string) => void;
}

const FormField: React.FC<Props> = ({ field, value, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        onChange(field.label, e.target.value);
    };

    // Determine if this is the Additional Information field
    const isFullWidth = field.label.toLowerCase().includes('additional information');

    if (field.type === 'select') {
        const options = field.placeholder.split(',').map(opt => opt.trim());
        return (
            <label className={isFullWidth ? 'full-width' : ''}>
                {field.label}
                <select
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                >
                    <option value="">Select</option>
                    {options.map((opt, i) => <option key={i}>{opt}</option>)}
                </select>
            </label>
        );
    }

    if (field.type === 'textarea') {
        return (
            <label className={isFullWidth ? 'full-width' : ''}>
                {field.label}
                <textarea
                    placeholder={field.placeholder}
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                />
            </label>
        );
    }

    return (
        <label className={isFullWidth ? 'full-width' : ''}>
            {field.label}
            <input
                type={field.type}
                placeholder={field.placeholder}
                value={value}
                onChange={handleInputChange}
                required={field.required}
            />
        </label>
    );
};

export default FormField;
