// CompetenciesAccordion.tsx (TypeScript)
import React from "react";
import { FaAngleUp } from "react-icons/fa";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";
import SafeIcon from "../../../utils/ComponentWrapper";
import LearningOutcomesFormRow from "./LearningOutcomesFormRow";
import './LearningOutcomesAccordian.css'

interface Props {
    sectionName: string;
    fields: SyllabusContent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}

const CompetenciesAccordion: React.FC<Props> = ({
                                                    sectionName,
                                                    fields,
                                                    formData,
                                                    onFieldChange,
                                                }) => {
    const sectionFields: SyllabusContent[] = fields.filter(
        (f) => f.section === "Step 1: Competencies" && f.row === 1
    );

    const title: SyllabusContent | undefined = sectionFields.find(
        (f) => f.layoutRow === 2
    );

    const cards: SyllabusContent[] = sectionFields.filter(
        (f) => f.layoutRow === 3
    );

    const remainingFields: SyllabusContent[] = sectionFields.filter(
        (f) => f.layoutRow >= 4
    );

    return (
        <div className="syllabus-section-accordion">
            <details open>
                <summary className="syllabus-section-header">
                    <span className="syllabus-section-title">{sectionName}</span>
                    <SafeIcon Icon={FaAngleUp} className="syllabus-section-arrow" />
                </summary>

                <div className="syllabus-section-content">
                    {/* layoutRow 1: intro */}
                    {sectionFields
                        .filter((f) => f.layoutRow === 1)
                        .map((f, i) => (
                            <p key={i} className="intro-paragraph">
                                {f.content}
                            </p>
                        ))}

                    {/* layoutRow 2: title */}
                    {title && <h2 className="centered-title">{title.content}</h2>}

                    {/* layoutRow 3: 5 competencies */}
                    <div className="core-competency-row">
                        {cards.map((f, i) => (
                            <div key={i} className="core-competency-card">
                                {f.iconPath && (
                                    <img
                                        src={f.iconPath}
                                        alt={f.content}
                                        className="core-icon"
                                    />
                                )}
                                <p>{f.content}</p>
                            </div>
                        ))}
                    </div>

                    {remainingFields.map((f, i) => (
                        <LearningOutcomesFormRow
                            key={i}
                            field={f}
                            value={formData[f.content] || ""}
                            onChange={onFieldChange}
                        />
                    ))}
                </div>
            </details>
        </div>
    );
};

export default CompetenciesAccordion;
