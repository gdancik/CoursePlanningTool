// CompetenciesFormRow.tsx
import React from "react";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import './LearningoutcomesFormRow.css'

interface Props {
    field: SyllabusContent;
    value: string;
    onChange: (label: string, value: string) => void;
}

const CompetenciesFormRow: React.FC<Props> = ({ field, value, onChange }) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onChange(field.content, e.target.value);
    };

    const isImage = /\.(png|jpe?g|gif|svg)$/i.test(field.iconPath || field.content);
    if (field.type === "text" && isImage) {
        let imgClass = "competency-image";

        if (field.content.includes("AdditionalCompetencies")) imgClass = "competency-warning";
        else if (field.content.includes("Knowledge")) imgClass = "competency-table knowledge";
        else if (field.content.includes("Skill")) imgClass = "competency-table skills";
        else if (field.content.includes("Attitudes")) imgClass = "competency-table attitudes";

        return (
            <img
                src={field.iconPath || field.content}
                alt="Competency Visual"
                className={imgClass}
            />
        );
    }


    if (field.type === "text") {

        return <p className="competency-text-row">{field.content}</p>;
    }

    if (field.type === "text-box") {
        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

        return (
            <div className="competency-form-group">
                <label className="competency-label">{field.content}</label>
                <textarea
                    className="competency-textarea"
                    value={value}
                    onChange={handleChange}
                    required={field.required}
                />
                <p className="competency-wordcount">Word Count: {wordCount} / 500 max</p>
            </div>
        );
    }

    if (field.type === "list") {
        return (
            <ul className="competency-list">
                {field.content.split("\n").map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        );
    }

    if (field.type === "header" || field.type === "category-header") {
        return <h3 className="competency-header">{field.content}</h3>;
    }

    return null;
};

export default CompetenciesFormRow;
