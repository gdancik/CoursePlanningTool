import React from "react";
import {jsonRenderComponent} from "./jsonRendererComponent";
import { JsonComponent } from "./jsonRendererComponent";
import '../../screens/SyllabusView/BasicInformation/BasicInfo.css'

interface GeneratePageContentProps {
    json: { content: JsonComponent[] };
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
}

const GeneratePageContent: React.FC<GeneratePageContentProps> = ({
                                                                     json,
                                                                     formData,
                                                                     onFieldChange,
                                                                 }) => {
    return (
        <div className="course-info-container">
            {json.content.map((component, i) => (
                <div key={i}>
                    {jsonRenderComponent(component, formData, onFieldChange)}
                </div>
            ))}
        </div>
    );
};

export default GeneratePageContent;
