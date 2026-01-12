import React from "react";
import {JsonRenderComponent} from "../../../utils/jsonRenderer";
import { JsonComponent } from "../../../utils/jsonRenderer";
import '../../../screens/SyllabusView/BasicInformation/BasicInfo.css'
import "./GeneratePageContent.css";

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

    const [showScroll, setShowScroll] = React.useState(false);

    React.useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="course-info-container">
            {json.content.map((component, i) => (
                <div key={i}>
                    <JsonRenderComponent component = {component} formData = {formData} onChange = {onFieldChange}/>
                </div>
            ))}

            {showScroll && (
                <a href="#top" id="scrollToTop" aria-label="Scroll to top">
                    ↑ Scroll to Top
                </a>
            )}
    
        </div>
          
    );
};

export default GeneratePageContent;
