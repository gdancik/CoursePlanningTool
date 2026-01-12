import React from "react";
import {JsonRenderComponent} from "../../../utils/jsonRenderer";
import { JsonComponent } from "../../../utils/jsonRenderer";
import ScrollToTop from "../../ScrollToTop/ScrollToTop";
import '../../../screens/SyllabusView/BasicInformation/BasicInfo.css'

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
                    <JsonRenderComponent component = {component} formData = {formData} onChange = {onFieldChange}/>
                </div>
            ))}          
            <ScrollToTop/>
        </div>
          
    );
};

export default GeneratePageContent;
