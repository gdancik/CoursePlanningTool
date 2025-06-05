import React from 'react';
import FormRow from './FormRow';
import { BasicInfoData } from '../../../utils/loadBasicInfoFields';
import './SectionAccordian.css';
import {FaAngleUp} from "react-icons/fa";
import SafeIcon from "../../../utils/ComponentWrapper";

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
        const rowKey = `${field.row}-${field.layoutRow || '0'}`;
        if (!acc[rowKey]) acc[rowKey] = [];
        acc[rowKey].push(field);
        return acc;
    }, {} as Record<string, BasicInfoData[]>);

    return (
        <div className="section-accordion">
            <details open>
                <summary className="section-header">
                    <span className="section-title">{sectionName}</span>
                    <SafeIcon Icon ={FaAngleUp} className="section-arrow"/>
                </summary>

                <div className="section-content">
                    {Object.entries(groupedRows).map(([rowKey, rowFields]) => (
                        <div key={rowKey} className="form-row">
                            {rowFields.map((field, index) => (
                                <FormRow
                                    key={index}
                                    field={field}
                                    value={formData[field.label] || ''}
                                    onChange={onFieldChange}
                                    className={field.label.includes ('Additional Information') ? 'full-width': ''}
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
