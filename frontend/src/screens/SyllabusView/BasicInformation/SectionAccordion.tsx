import React from 'react';
import formRow from './FormRow';
import {BasicInfoData} from "../../../utils/loadBasicInfoFields";
import FormRow from "./FormRow";

interface Props {
    sectionName: string;
    fields: BasicInfoData[];
    formData: Record<string,string>;
    onFieldChange: (label: string, value: string) => void;
}

const SectionAccordion: React.FC<Props> = ({
    sectionName, fields, formData, onFieldChange,
}) => (
    <details open>
        <summary className="section-title">{sectionName}</summary>
        <div className="section-content">
            {fields.map((field, index) =>(
                <FormRow
                    key={index}
                    field={field}
                    value={formData[field.label] || ''}
                    onChange={onFieldChange}
                />
            ))}
        </div>
    </details>
);

export default SectionAccordion;