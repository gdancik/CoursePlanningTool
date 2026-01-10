import React from 'react';
import './ContentCard.css';

/**
 * @function ContentCard
 * @description A reusable content card component with editable title, description, and optional right-value field.
 * Used as a building block for Learning Outcomes, Assignments, and Grading Policies components.
 * Features editable fields with labels and flexible right-side value display.
 * @param {string} titleLabel - The label text for the title field
 * @param {string} titleValue - The current value of the title field
 * @param {string} descriptionLabel - The label text for the description field  
 * @param {string} descriptionValue - The current value of the description field
 * @param {string} [rightLabel] - Optional label for the right-side value field
 * @param {string} [rightValue] - Optional value for the right-side field (e.g., percentage)
 * @param {Function} onTitleChange - Callback function when title changes
 * @param {Function} onDescriptionChange - Callback function when description changes
 * @param {Function} [onRightValueChange] - Optional callback function when right value changes
 * @param {string} [className] - Optional CSS class name for custom styling
 * @returns {JSX.Element} A styled content card with editable fields
 * @example
 * <ContentCard
 *   titleLabel="Learning Outcome 1 Title:"
 *   titleValue={outcome1Title}
 *   descriptionLabel="Learning Outcome 1 Description:"
 *   descriptionValue={outcome1Description}
 *   rightLabel="Points:"
 *   rightValue="25%"
 *   onTitleChange={(value) => setOutcome1Title(value)}
 *   onDescriptionChange={(value) => setOutcome1Description(value)}
 *   onRightValueChange={(value) => setOutcome1Points(value)}
 * />
 */
interface ContentCardProps {
    titleLabel: string;
    titleValue: string;
    descriptionLabel: string;
    descriptionValue: string;
    rightLabel?: string;
    rightValue?: string;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onRightValueChange?: (value: string) => void;
    className?: string;
    separateLabel?: boolean;   // to display label above input
}

const ContentCard: React.FC<ContentCardProps> = ({
    titleLabel,
    titleValue,
    descriptionLabel,
    descriptionValue,
    rightLabel,
    rightValue,
    onTitleChange,
    onDescriptionChange,
    onRightValueChange,
    className = '',
    separateLabel = false
}) => {
    return (
        <div className={`content-card ${className}`}>
            <div className="content-card-header">
                <div className="content-card-title-section">
                    {separateLabel && <label className="content-card-label">{titleLabel}</label>}
                    <input
                        type="text"
                        value = {!separateLabel ? titleValue : ""}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="content-card-title-input"
                        placeholder="Enter title..."
                    />
                </div>
                
                {rightLabel && onRightValueChange && (
                    <div className="content-card-right-section">
                        {separateLabel && <label className="content-card-right-label">{rightLabel}</label>}
                        <input
                            type="text"                            
                            value={rightValue?.trim() || ''}
                            onChange={(e) => onRightValueChange(e.target.value)}
                            className="content-card-right-input"
                            placeholder="Points (or %)"
                        />
                    </div>
                )}
            </div>
            
            <div className="content-card-description-section">
                {/*<label className="content-card-label">{descriptionLabel}</label>*/}
                <textarea
                    value={descriptionValue}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="content-card-description-textarea"
                    placeholder="Enter description..."
                    rows={4}
                />
                <div className="word-count">
                    Word Count: {descriptionValue.trim().split(/\s+/).filter(word => word.length > 0).length} / 500 words max
                </div>
            </div>
        </div>
    );
};

export default ContentCard;