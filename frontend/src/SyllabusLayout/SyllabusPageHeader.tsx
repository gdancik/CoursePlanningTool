import React from "react";
import SyllabusHeader from "./Header/SyllabusHeader";
import AppLayoutButtons from "./Button/AppLayoutButtons";
import SyllabusNav from "./Navigation/SyllabusNav";

interface SyllabusPageHeaderProps {
    onBack?: (save?: boolean) => void;
    onNext?: (save?: boolean) => void;
    onSave?: () => void;
    onSaveAndNavigate?: (navigateTo: string) => void;
    onPreview?: () => void;
    changesDetected?: boolean;
    setChangesDetected?: (x: boolean) => void;
    courseNumber?: string;
}

const SyllabusPageHeader: React.FC<SyllabusPageHeaderProps> = ({
                                                                   onBack,
                                                                   onNext,
                                                                   onSave,
                                                                   onSaveAndNavigate,
                                                                   onPreview,
                                                                   changesDetected,
                                                                   setChangesDetected,
                                                                   courseNumber,
                                                               }) => {
    return (
        <div style={{ position: "sticky", top: "0px", width: "100%", zIndex: "1000" }}>
            <SyllabusHeader courseNumber={courseNumber} />

            <AppLayoutButtons
                onBack={onBack}
                onNext={onNext}
                onSave={onSave}
                onSaveAndNavigate={onSaveAndNavigate}
                onPreview={onPreview}
                changesDetected={changesDetected}
                setChangesDetected={setChangesDetected}
            />

            <SyllabusNav onSave={onSave} changesDetected={changesDetected} />
        </div>
    );
};

export default SyllabusPageHeader;