import React, {useEffect} from "react";
import './ErrorModal.css'
import ErrorIcon from "../../../assets/images/Error-Message.png"
import {detailedErrors} from "../../../configs/courseConfig.json"

type Props ={
    message: string;
    detailedMsg?: string;
    errorCode?: number;
    onClose: () => void;
};

const ErrorModal: React.FC<Props> = ({message, errorCode,detailedMsg, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 10000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return(
        <div className = "error-modal-backdrop">
            <div className="error-modal">
                <button className="close-button" onClick={onClose}>x</button>
                    <img
                        src={ErrorIcon}
                        alt="Error Icon"
                        className="error-icon"
                    />
                <h2 className="error-title">Error</h2>
                <p className="error-message">{message}</p>
                {errorCode && (
                    <p className="error-code">Error Code: {errorCode}</p>
                )}
            </div>
        </div>
    );
};

export default ErrorModal;