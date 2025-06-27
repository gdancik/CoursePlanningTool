import React from "react";
import "./RedirectingModal.css"

interface RedirectingModalProps {
    visible: boolean;
    status: "loading" | "success";
    title: string;
    message: string;
}

const RedirectingModal: React.FC<RedirectingModalProps> = ({ visible, status, title, message }) => {
    if (!visible) return null;

    return (
        <div className="redirect-overlay">
            <div className="redirect-content">
                {status === "loading" ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="checkmark">&#10004;</div>
                )}
                <h2>{title}</h2>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default RedirectingModal;