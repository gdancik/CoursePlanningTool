import React from "react";
import HeaderBanner from "./components/HeaderBanner";
import SyllabusNav from "../navigation/SyllabusNav";
import ButtonBar from "./components/ButtonBar";


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
            <ButtonBar
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
