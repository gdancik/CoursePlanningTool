import React from "react";
import {JsonRenderComponent} from "../../../utils/PageRenderEngine/jsonRenderer";
import { JsonComponent} from "../../../utils/PageRenderEngine/types";
import ScrollToTop from "../../ScrollToTop/ScrollToTop";
import '../../../screens/SyllabusView/BasicInformation/BasicInfo.css'
import {FormState, FormValue} from "../../../utils/PageRenderEngine/types";

interface GeneratePageContentProps {
    json: { content: JsonComponent[] };
    formData: FormState
    onFieldChange: (label: string, value: FormValue) => void;
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
