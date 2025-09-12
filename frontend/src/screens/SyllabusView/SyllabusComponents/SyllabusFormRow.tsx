import React from "react";
import SyllabusFormField from "./SyllabusFormField";
import { SyllabusContent } from "../../../utils/loadSyllabusContent";

interface Props {
    field: SyllabusContent;
    value: string;
    onChange: (name: string, value: string) => void;
}

const SyllabusFormRow: React.FC<Props> = ({ field, value, onChange }) => {
    return (
        <div className={`syllabus-form-row`}>
            <SyllabusFormField field={field} value={value} onChange={onChange} />
        </div>
    );
};

export default SyllabusFormRow;
