import React, { useState } from "react";
import { jsonRenderComponent } from "../../utils/jsonRenderer"
import SyllabusLayout from "../../SyllabusLayout/SyllabusPageHeader";
import jsonSchema from "../SyllabusView/Data/basic-info-test.json"

export default function JsonSyllabusPage() {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const handleChange = (label: string, value: string) =>
        setFormData(prev => ({ ...prev, [label]: value }));

    return (
    <div>
        <SyllabusLayout/>
        <div className="course-info-container">
        <form>
            {jsonSchema.content.map((c, i) => (
                <div key={i}>{jsonRenderComponent(c, formData, handleChange)}</div>
            ))}
        </form>
        </div>
    </div>
);
}
