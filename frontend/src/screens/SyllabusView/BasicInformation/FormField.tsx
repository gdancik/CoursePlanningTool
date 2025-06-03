import React from 'react';
import { BasicInfoData } from '../../../utils/loadBasicInfoFields'

interface Props {
    field: BasicInfoData;
    value: string;
    onChange: (label: string, value: string) => void;
}

const FormField: React.FC<Props> = ({ field, value, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(field.label, e.target.value);
    };

    if(field.type === 'select') {
        const options = field.placeholder.split(',').map(opt=> opt.trim());
        return(
            <label>
                {field.label}
                <select
                    value={value}
                    onChange={handleInputChange}
                    required={field.required}
                >
                    <option value ="">Select</option>
                    {options.map((opt, i) => <option key={i}>{opt}</option>)}
                </select>
            </label>
        );
    }

    return(
        <label>
            {field.label}
            <input
                type = {field.type}
                placeholder={field.placeholder}
                value={value}
                onChange={handleInputChange}
                required={field.required}
            />
        </label>
    );
};
export default FormField;
