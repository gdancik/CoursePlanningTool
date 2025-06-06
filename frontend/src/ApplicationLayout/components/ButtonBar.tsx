import React from "react";
import ReusableButton from "../../components/ReusableButton";
import {FaArrowLeft, FaArrowRight, FaEye, FaRegSave, FaRegWindowClose} from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import "./ButtonBar.css";

interface ButtonBarProps {
    onBack?: () => void;
    onNext?: () => void;
    onSave?: () => void;
    onSaveAndExit?: () => void;
    onPreview?: () => void;
    showSaveButtons?: boolean;
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
                icon ={<SafeIcon Icon={FaRegSave}/>}
                variant ="primary"
                onClick={onSave}
            />
            <ReusableButton
                label="Save & Exit"
                icon={<SafeIcon Icon={FaRegWindowClose}/>}
                variant ="exit"
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
