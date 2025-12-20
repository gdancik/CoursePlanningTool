
import React from "react";
import SyllabusHeader from "./Header/SyllabusHeader";
import AppLayoutButtons from "./Button/AppLayoutButtons";
import SyllabusNav from "./Navigation/SyllabusNav";

interface SyllabusPageHeaderProps {
    onBack?: () => void;
    onNext?: () => void;
    onSave?: () => void;
    onSaveAndExit?: (navigate_to: string) => void;
    onPreview?: () => void;
    changesDetected?: boolean;
    setChangesDetected?: (x:boolean) => void;
}

const SyllabusPageHeader: React.FC<SyllabusPageHeaderProps> = ({
                                                                   onBack,
                                                                   onNext,
                                                                   onSave,
                                                                   onSaveAndExit,
                                                                   onPreview,
                                                                   changesDetected,
                                                                   setChangesDetected,
                                                               }) => {
    
    return (
        <div style = {{position: "sticky", top: "0px", width: "100%", zIndex: "1000"}}>
            <SyllabusHeader />                 
            <AppLayoutButtons
                onBack={onBack}
                onNext={onNext}
                onSave={onSave}
                onSaveAndExit={onSaveAndExit}
                onPreview={onPreview}
                changesDetected = {changesDetected}
                setChangesDetected = {setChangesDetected}
            />
            
            <SyllabusNav onSave={onSave} changesDetected={changesDetected} />
        </div>
    );
};

export default SyllabusPageHeader;
