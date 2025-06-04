import React from 'react';
import FormField from "./FormField";
import {BasicInfoData} from "../../../utils/loadBasicInfoFields";
import './FormRow.css';

interface Props{
    field: BasicInfoData;
    value: string;
    onChange: (name: string, value: string) => void;
    className?: string;
}

const FormRow: React.FC<Props> = ({field, value, onChange, className}) => (
    <div className={`form-row ${className || ''}`}>
        <FormField field={field} value={value} onChange={onChange} />
    </div>
)

export default FormRow;