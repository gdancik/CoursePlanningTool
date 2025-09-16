import React, { useState } from "react";
import { jsonRenderComponent } from "../components/SyllabusComponents/jsonRendererComponent"
import Applayout from "../ApplicationLayout/Applayout";
import jsonSchema from "./SyllabusView/Data/basic-info-test.json"

export default function JsonSyllabusPage() {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const handleChange = (label: string, value: string) =>
        setFormData(prev => ({ ...prev, [label]: value }));

    return (
    <div>
        <Applayout/>
        <form>
            {jsonSchema.content.map((c, i) => (
                <div key={i}>{jsonRenderComponent(c, formData, handleChange)}</div>
            ))}
        </form>
    </div>
);
}
