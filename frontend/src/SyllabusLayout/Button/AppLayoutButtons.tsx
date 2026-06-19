import React, {useState, useEffect} from "react";
import ReusableButton from "../../components/Button/ReusableButton";
import {FaArrowLeft, FaArrowRight, FaEye, FaRegSave, FaRegWindowClose, FaSignOutAlt} from "react-icons/fa";
import SafeIcon from "../../utils/course/ComponentWrapper";
import HomeButton from "../../assets/images/HomeButton.png"
import "./AppLayoutButtons.css";

interface ButtonBarProps {
    onBack?: (x:boolean) => void;
    onNext?: (x:boolean) => void;
    onSave?: () => void;
    onSaveAndExit?: (navigate_to: string) => void;
    onPreview?: () => void;
    showSaveButtons?: boolean;
    changesDetected?: boolean;
    setChangesDetected?: (x:boolean) => void;
}

// Functional component that renders a button bar that includes a changes detected message
const AppLayoutButtons: React.FC<ButtonBarProps> = ({
                                                 onBack,
                                                 onNext,
                                                 onSave,
                                                 onSaveAndExit,
                                                 onPreview,
                                                 changesDetected = false,
                                                 setChangesDetected = () =>{}
                                             }) => {
    


    // update changesDetectedHere state on render
    /****
    useEffect(() => {    
        setChangesDetectedHere(changesDetected);
        //alert(changesDetected + "-" + changesDetectedHere);
      }, [changesDetected]); // Empty dependency array
     ****/

    return (
        <div className="button-bar">

        <style>
        {`
        .tooltip {
            position: relative;
            display: inline-block;
            cursor: pointer;
        }

        .tip {
            display: none;
            position: absolute;
            top: 100%;
            //left: 50%;
            transform: translateX(-80%);
            transform: translateY(-50%);
            border: 1px solid darkred;
            background-color: white;
            padding: 8px;
            width: 250px;
            z-index: 10;
        }

        .tooltip:hover .tip {
            display: block;
        }

        .q {
            color: #1a0dab;
            text-decoration: underline;
        }
        `}
        </style>

        {changesDetected && 
        <p style={{fontSize: "1.1rem", margin: "0 auto", textAlign: "center", fontWeight: "bold", color: "#851e1e"}}>
            <span className="text">Changes detected! </span>
            <span className="tooltip">
                (<span className="q">?</span>)
                <span className="tip">
                    Changes will be automatically saved when navigating to a new page.<br/>
                    Click Discard to discard your changes.
                </span>
            </span>
        </p>
        }

            {/* Back Button */}
            <ReusableButton
                label="Back"
                icon={<SafeIcon Icon={FaArrowLeft} />} // Left arrow icon
                variant="secondary"                   // Secondary styling variant
                onClick={() => onBack?.(changesDetected)}                      // Call the onBack callback if provided
                disabled = {onBack === undefined}
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
                onClick={ () => {
                    if (onSave) onSave();
                    setChangesDetected(false);
                }}
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
                onClick={() => {onSaveAndExit?.('/course-page')}}                      // Call the onSaveAndExit callback if provided
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
                onClick={() => {onSaveAndExit?.('/')}}                 
            />

        </div>
    );
};


export default AppLayoutButtons;
