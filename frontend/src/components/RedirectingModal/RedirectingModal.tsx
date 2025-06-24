import React from "react";
import "./RedirectingModal.css"

const RedirectingModal: React.FC = () => {
    return(
        <div className="redirect-overlay">
            <div className="redirect-content">
                <div className="spinner"></div>
                <h2>Successfully Logged in</h2>
                <p>Message</p>
            </div>
        </div>
    );
};

export default RedirectingModal;