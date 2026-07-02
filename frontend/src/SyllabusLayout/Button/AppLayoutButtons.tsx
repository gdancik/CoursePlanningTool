import React from "react";
import ReusableButton from "../../components/Button/ReusableButton";
import {
    FaArrowLeft,
    FaArrowRight,
    FaEye,
    FaRegSave,
    FaSignOutAlt,
} from "react-icons/fa";
import SafeIcon from "../../utils/course/ComponentWrapper";
import HomeButton from "../../assets/images/HomeButton.png";
import "./AppLayoutButtons.css";

interface ButtonBarProps {
    onBack?: (save?: boolean) => void;
    onNext?: (save?: boolean) => void;
    onSave?: () => void;
    onSaveAndNavigate?: (navigateTo: string) => void;
    onPreview?: () => void;
    showSaveButtons?: boolean;
    changesDetected?: boolean;
    setChangesDetected?: (x: boolean) => void;
}

const AppLayoutButtons: React.FC<ButtonBarProps> = ({
                                                        onBack,
                                                        onNext,
                                                        onSave,
                                                        onSaveAndNavigate,
                                                        onPreview,
                                                        changesDetected = false,
                                                        setChangesDetected = () => {},
                                                    }) => {
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

            {changesDetected && (
                <p
                    style={{
                        fontSize: "1.1rem",
                        margin: "0 auto",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#851e1e",
                    }}
                >
                    <span className="text">Changes detected! </span>
                    <span className="tooltip">
                        (<span className="q">?</span>)
                        <span className="tip">
                            Changes will be automatically saved when navigating to a new page.
                            <br />
                            Click Discard to discard your changes.
                        </span>
                    </span>
                </p>
            )}

            <ReusableButton
                label="Back"
                icon={<SafeIcon Icon={FaArrowLeft} />}
                variant="secondary"
                onClick={() => onBack?.(changesDetected)}
                disabled={onBack === undefined}
            />

            <ReusableButton
                label="Next"
                icon={<SafeIcon Icon={FaArrowRight} />}
                variant="secondary"
                onClick={() => onNext?.(changesDetected)}
                disabled={onNext === undefined}
            />

            <ReusableButton
                label="Save"
                icon={<SafeIcon Icon={FaRegSave} />}
                variant="primary"
                onClick={() => {
                    onSave?.();
                    setChangesDetected(false);
                }}
                disabled={!changesDetected}
            />

            <ReusableButton
                label="Discard"
                variant={changesDetected ? "red" : "secondary"}
                onClick={() => window.location.reload()}
                disabled={!changesDetected}
            />

            <ReusableButton
                label="&nbsp;"
                icon={<img src={HomeButton} alt="Home" className="Home" />}
                variant="exit"
                onClick={async () => {
                    await onSaveAndNavigate?.("/course-page");
                }}
            />

            <ReusableButton
                label="Preview Syllabus"
                icon={<SafeIcon Icon={FaEye} />}
                variant="green"
                onClick={onPreview}
            />

            <ReusableButton
                label="Logout"
                icon={<SafeIcon Icon={FaSignOutAlt} />}
                variant="secondary"
                onClick={() => onSaveAndNavigate?.("/")}
            />
        </div>
    );
};

export default AppLayoutButtons;