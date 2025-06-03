import React from 'react';
import FormRow from './FormRow';
import { BasicInfoData } from '../../../utils/loadBasicInfoFields';
import './SectionAccordian.css';

interface Props {
    sectionName: string;
    fields: BasicInfoData[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}

const SectionAccordion: React.FC<Props> = ({
                                               sectionName,
                                               fields,
                                               formData,
                                               onFieldChange,
                                           }) => (
    <div className="section-accordion">
        <details open>
            <summary className="section-header">
                <span className="section-title">{sectionName}</span>
                <span className="section-arrow">▼</span>
            </summary>

            <div className="section-content">
                {fields.map((field, index) => (
                    <FormRow
                        key={index}
                        field={field}
                        value={formData[field.label] || ''}
                        onChange={onFieldChange}
                    />
                ))}
            </div>
        </details>
    </div>
);

export default SectionAccordion;
