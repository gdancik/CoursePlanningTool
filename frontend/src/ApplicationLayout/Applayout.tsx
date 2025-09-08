import React from "react";
import HeaderBanner from "./Header/HeaderBanner";
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

const Applayout: React.FC<AppLayoutProps> = ({
                                                 onBack,
                                                 onNext,
                                                 onSave,
                                                 onSaveAndExit,
                                                 onPreview,
                                                 children,
                                             }) => {
    return (
        <div>
            <HeaderBanner />

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

export default Applayout;
