import React from "react";
import ReusableButton from "../../components/Button/ReusableButton";
import {FaArrowLeft, FaArrowRight, FaEye, FaRegSave, FaRegWindowClose, FaSignOutAlt} from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import HomeButton from "../../assets/images/HomeButton.png"
import "./AppLayoutButtons.css";

interface ButtonBarProps {
    onBack?: (x:boolean) => void;
    onNext?: (x:boolean) => void;
    onSave?: () => void;
    onSaveAndExit?: () => void;
    onPreview?: () => void;
    showSaveButtons?: boolean;
    changesDetected?: boolean;
}

// Functional component that renders a button bar
const AppLayoutButtons: React.FC<ButtonBarProps> = ({
                                                 onBack,
                                                 onNext,
                                                 onSave,
                                                 onSaveAndExit,
                                                 onPreview,
                                                 changesDetected = false
                                             }) => {
    
    return (
        <div className="button-bar">
            {/* Back Button */}
            <ReusableButton
                label="Back"
                icon={<SafeIcon Icon={FaArrowLeft} />} // Left arrow icon
                variant="secondary"                   // Secondary styling variant
                onClick={() => onBack?.(changesDetected)}                      // Call the onBack callback if provided
            />

            {/* Next Button */}
            <ReusableButton
                label="Next"
                icon={<SafeIcon Icon={FaArrowRight} />} // Right arrow icon
                variant="secondary"                     // Secondary styling variant
                onClick={() => onNext?.(changesDetected)}                        // Call the onNext callback if provided
            />

            {/* Save Button */}
            <ReusableButton
                label="Save"
                icon={<SafeIcon Icon={FaRegSave} />}   // Save icon
                variant="primary"                      // Primary styling variant
                onClick={onSave}                       // Call the onSave callback if provided
                disabled = {!changesDetected}
            />

            <ReusableButton
                label="Discard"
                variant= {changesDetected ? "red" : "secondary"}
                onClick={() => window.location.reload()}
                disabled = {!changesDetected}

            />

            {/* Save & Exit Button */}
            <ReusableButton
                label="&nbsp;"
                icon={<img src = {HomeButton} alt = "Home" className="Home"/>} // Close icon
                variant="exit"                               // Exit styling variant
                onClick={onSaveAndExit}                      // Call the onSaveAndExit callback if provided
            />

            {/* Preview Syllabus Button */}
            <ReusableButton
                label="Preview Syllabus"
                icon={<SafeIcon Icon={FaEye} />}     // Eye icon for preview
                variant="green"                      // Green styling variant
                onClick={onPreview}                  // Call the onPreview callback if provided
            />

            {/* Logout Button */}
            <ReusableButton
                label="Logout"
                icon={<SafeIcon Icon={FaSignOutAlt} />}     // Eye icon for preview
                variant="secondary"                     // Green styling variant
                onClick={() => {
                    alert('Returning to Home Page (data will not be saved)');
                   window.location.href = '/';
                    }
                }       // Call the onPreview callback if provided
            />

        </div>
    );
};


export default AppLayoutButtons;
