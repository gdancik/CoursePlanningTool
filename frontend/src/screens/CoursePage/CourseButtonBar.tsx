import React from "react";
import ReusableButton from "../../components/Button/ReusableButton";
import {FaArrowDown} from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import "./CourseButtonBar.css";

interface ButtonBarProps {
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
}

// Functional component that renders a button bar
const CourseButtonBar: React.FC<ButtonBarProps> = ({
                                                 onEdit,
                                                 onDuplicate,
                                                 onDelete,
                                                 onDownload,
                                             }) => {

    return (
        <div className="course-button-bar">

            <div className="top-button-row">
                {/* Save Button */}
                <ReusableButton
                    label="Edit"
                    variant="green"
                    className="tight"
                    onClick={onEdit}                       // Call the onSave callback if provided
                />
                <ReusableButton
                    label="Duplicate"
                    variant="secondary"
                    className="tight"
                    onClick={onDuplicate}
                />

                {/* Save & Exit Button */}
                <ReusableButton
                    label="Delete"
                    variant="exit"
                    className="tight"
                    onClick={onDelete}
                />
            </div>
            <div className="bottom-button-row">
                {/* Preview Syllabus Button */}
                <ReusableButton
                    label="Download Syllabus"
                    icon={<SafeIcon Icon={FaArrowDown}/>}
                    variant="primary"
                    className="tight"
                    onClick={onDownload}
                />
            </div>
        </div>
    );
};


export default CourseButtonBar;
