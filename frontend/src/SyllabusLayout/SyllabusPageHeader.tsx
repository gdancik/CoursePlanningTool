
import React from "react";
import SyllabusHeader from "./Header/SyllabusHeader";
import AppLayoutButtons from "./Button/AppLayoutButtons";
import SyllabusNav from "./Navigation/SyllabusNav";

interface SyllabusPageHeaderProps {
    onBack?: () => void;
    onNext?: () => void;
    onSave?: () => void;
    onSaveAndExit?: () => void;
    onPreview?: () => void;
}

const SyllabusPageHeader: React.FC<SyllabusPageHeaderProps> = ({
                                                                   onBack,
                                                                   onNext,
                                                                   onSave,
                                                                   onSaveAndExit,
                                                                   onPreview,
                                                               }) => {
    return (
        <div>
            <SyllabusHeader />

            <AppLayoutButtons
                onBack={onBack}
                onNext={onNext}
                onSave={onSave}
                onSaveAndExit={onSaveAndExit}
                onPreview={onPreview}
            />

            <SyllabusNav />
        </div>
    );
};

export default SyllabusPageHeader;
