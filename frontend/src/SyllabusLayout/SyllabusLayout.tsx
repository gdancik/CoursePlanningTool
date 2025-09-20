import React from "react";
import SyllabusHeader from "./Header/SyllabusHeader";
import SyllabusNav from "./Navigation/SyllabusNav";
import AppLayoutButtons from "./Button/AppLayoutButtons";


interface AppLayoutProps {
    onBack?: () => void;
    onNext?: () => void;
    onSave?: () => void;
    onSaveAndExit?: () => void;
    onPreview?: () => void;
    children?: React.ReactNode;

}

const SyllabusLayout: React.FC<AppLayoutProps> = ({
                                                 onBack,
                                                 onNext,
                                                 onSave,
                                                 onSaveAndExit,
                                                 onPreview,
                                                 children,
                                             }) => {
    return (
        <div>
            <SyllabusHeader />

            {/* Buttons below the header banner */}
            <AppLayoutButtons
                onBack={onBack}
                onNext={onNext}
                onSave={onSave}
                onSaveAndExit={onSaveAndExit}
                onPreview={onPreview}
            />

            <SyllabusNav />

            <main style={{ padding: "0.1rem" }}>
                {children}
            </main>
        </div>
    );
};

export default SyllabusLayout;
