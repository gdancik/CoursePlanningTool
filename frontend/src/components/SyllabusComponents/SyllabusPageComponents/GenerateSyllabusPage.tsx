import React, { useState } from "react";
import SyllabusLayout from "../../../SyllabusLayout/SyllabusPageHeader";
import GeneratePageContent from "./GeneratePageContent"
import { JsonComponent} from "../../../utils/jsonRenderer";

interface GenerateSyllabusPageProps {
    json: JsonComponent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
    onBack: () => void;
    onNext: () => void;
    onSave?: () => void;
    onSaveAndExit?: (navigate_to:string) => void;
    onPreview: () => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}
const GenerateSyllabusPage = ({
                                  json,
                                  formData,
                                  onFieldChange,
                                  onBack,
                                  onNext,
                                  onSave,
                                  onSaveAndExit,
                                  onPreview,
                                  containerRef,
                              }: GenerateSyllabusPageProps) => {


    const [changesDetected, setChangesDetected] = useState(false);

    return (
            <div ref ={containerRef} onInput = {() => {                
                setChangesDetected(true)
            }}>                                
                <SyllabusLayout
                        {...{ onBack, onNext, onSave, onSaveAndExit, onPreview, changesDetected, setChangesDetected }}
                /> 
                
                 {/*changesDetected && <p>Some input has changed!</p>*/} 
                 
                <GeneratePageContent
                    json={{content: json}}
                    formData={formData}
                    onFieldChange={onFieldChange} />
            </div>             
    )             
};


export default GenerateSyllabusPage