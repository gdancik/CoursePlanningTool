import React from "react";
import ReusableButton from "../../components/ReusableButton";
import { FaArrowLeft, FaArrowRight, FaEye } from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import "./ButtonBar.css";

interface ButtonBarProps {
    onBack?: () => void;
    onNext?: () => void;
    onSave?: () => void;
    onSaveAndExit?: () => void;
    onPreview?: () => void;
}

const ButtonBar: React.FC<ButtonBarProps> = ({
                                                         onBack,
                                                         onNext,
                                                         onSave,
                                                         onSaveAndExit,
                                                         onPreview,
                                                     }) => {
    return (
        <div className="button-bar">
            <ReusableButton
                label="Back"
                icon={<SafeIcon Icon={FaArrowLeft} />}
                variant ="secondary"
                onClick={onBack}
            />
            <ReusableButton
                label="Next"
                icon={<SafeIcon Icon={FaArrowRight} />}
                variant="secondary"
                onClick={onNext}
            />
            <ReusableButton
                label="Save"
                variant ="primary"
                onClick={onSave}
            />
            <ReusableButton
                label="Save & Exit"
                variant ="primary"
                onClick={onSaveAndExit}
            />
            <ReusableButton
                label="Preview Syllabus"
                variant="green"
                icon={<SafeIcon Icon={FaEye} />}
                onClick={onPreview}
            />
        </div>
    );
};

export default ButtonBar;
