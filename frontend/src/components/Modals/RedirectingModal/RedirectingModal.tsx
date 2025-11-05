import React from "react";
import "./RedirectingModal.css"

interface RedirectingModalProps {
    visible: boolean;
    status: "loading" | "success" | "error";
    title: string;
    message: string;
}

const RedirectingModal: React.FC<RedirectingModalProps> = ({ visible, status, title, message }) => {
    if (!visible) return null;

    return (
        <div className="redirect-overlay">
            <div className="redirect-content">
                {status === "loading" && (
                    <div className="spinner"></div>
                )}
                {status === "success" && (
                    <div className="checkmark">&#10004;</div>
                )}
                {status === "error" && (

                    <div className="errormark">&#10006;</div>
                )}
                <h2>{title}</h2>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default RedirectingModal;