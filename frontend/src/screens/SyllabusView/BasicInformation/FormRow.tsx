import React from 'react';
import FormField from "./FormField";
import {BasicInfoData} from "../../../utils/loadBasicInfoFields";
import {generateRowIdentifiers} from "../../../utils/generateRowIdentifiers";

interface Props{
    field: BasicInfoData;
    value: string;
    onChange: (name: string, value: string) => void;
    className?: string;
}

const FormRow: React.FC<Props> = ({field, value, onChange, className}) => {
        const rowIdentifier = generateRowIdentifiers(field.label);

        return (
            <div className={`form-row ${rowIdentifier} ${className || ''}`}>

                <FormField field={field} value={value} onChange={onChange}/>
            </div>
        );
    };

export default FormRow;