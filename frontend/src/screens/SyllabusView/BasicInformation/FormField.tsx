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

    if (field.type === 'textarea') {
        return (
            <label>
                {field.label}
                <p className="helper-text">{field.placeholder}</p>
                <textarea
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                />
            </label>
        );
    }
    if (field.type === 'checkbox-group' && field.options) {
        return (
            <div className="checkbox-group">
                <label>{field.label}</label>
                <div className="checkbox-options">
                    {field.options.map((day, idx) => (
                        <label key={idx}>
                            <input
                                type="checkbox"
                                checked={value.includes(day)}
                                value={day}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    let updatedValue = value.split(',').filter(Boolean);
                                    if (isChecked) {
                                        updatedValue.push(day);
                                    } else {
                                        updatedValue = updatedValue.filter((v) => v !== day);
                                    }
                                    onChange(field.label, updatedValue.join(','));
                                }}
                            />
                            {day}
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <label>
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
