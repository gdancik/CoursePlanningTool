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
                                           }) => {
    const groupedRows = fields.reduce((acc, field) => {
        const rowKey = field.row || 'default';
        if (!acc[rowKey]) acc[rowKey] = [];
        acc[rowKey].push(field);
        return acc;
    }, {} as Record<string, BasicInfoData[]>);

    return (
        <div className="section-accordion">
            <details open>
                <summary className="section-header">
                    <span className="section-title">{sectionName}</span>
                    <span className="section-arrow">▼</span>
                </summary>

                <div className="section-content">
                    {Object.entries(groupedRows).map(([row, rowFields]) => (
                        <div key={row} className="form-row">
                            {rowFields.map((field, index) => (
                                <FormRow
                                    key={index}
                                    field={field}
                                    value={formData[field.label] || ''}
                                    onChange={onFieldChange}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
};

export default SectionAccordion;
