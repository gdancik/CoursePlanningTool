import React from 'react';
import FormField from "./FormField";
import {BasicInfoData} from "../utils/loadBasicInfoFields";

interface Props{
    field: BasicInfoData;
    value: string;
    onChange: (name: string, value: string) => void;
}

const FormRow: React.FC<Props> = ({field, value, onChange}) => (
    <div className="form-row">
        <FormField field={field} value={value} onChange={onChange} />
    </div>
)

export default FormRow;