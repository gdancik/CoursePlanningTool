// This component groups related form fields into an expandable/collapsible section (accordion).

import React from 'react';
import FormRow from './FormRow';                       // Component for rendering individual form rows
import { BasicInfoData } from '../../../utils/loadBasicInfoFields'; // Type for field data
import './SectionAccordian.css';
import { FaAngleUp } from "react-icons/fa";           // Icon for the accordion toggle
import SafeIcon from "../../../utils/ComponentWrapper"; // Wrapper for safe icon rendering

interface Props {
    sectionName: string;                              // Name of the section (e.g., "Personal Info")
    fields: BasicInfoData[];                          // Array of fields in this section
    formData: Record<string, string>;                 // Current form data (keyed by field label)
    onFieldChange: (label: string, value: string) => void; // Callback to handle changes in fields
}

const SectionAccordion: React.FC<Props> = ({
                                               sectionName,
                                               fields,
                                               formData,
                                               onFieldChange,
                                           }) => {


    // Group fields by row identifiers to control layout
    const groupedRows = fields.reduce((acc, field) => {
        const rowKey = `${field.row}-${field.layoutRow || '0'}`; // Unique row key
        if (!acc[rowKey]) acc[rowKey] = [];
        acc[rowKey].push(field);                                 // Add the field to its row group
        return acc;
    }, {} as Record<string, BasicInfoData[]>);

    return (
        <div className="section-accordion">
            {/* HTML <details> for collapsible accordion */}
            <details open>
                <summary className="section-header">

                    {/* Section title */}
                    <span className="section-title">{sectionName}</span>

                    {/* Collapse/expand icon */}
                    <SafeIcon Icon={FaAngleUp} className="section-arrow" />
                </summary>

                {/* Content of the accordion section */}
                <div className="section-content">
                    {Object.entries(groupedRows).map(([rowKey, rowFields]) => (
                        <div key={rowKey} className="form-row">

                            {/* Render each field in the row */}
                            {rowFields
                                .filter((field) => {
                                    const isConditional = field.row === 1 && field.layoutRow === 3;
                                    const valueTrigger = formData["Additional Meeting Times"] || "";
                                    return !isConditional || valueTrigger.includes("Yes");
                                })
                                .map((field, index) => (
                                <FormRow
                                    key={index}                             // Unique key for the row
                                    field={field}                           // Field data
                                    value={formData[field.label] || ''}     // Current field value
                                    onChange={onFieldChange}                // Change handler
                                    className={
                                        field.label.includes('Additional Information')
                                            ? 'full-width'
                                            : ''
                                    } // Extra class for full-width styling if applicable
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
