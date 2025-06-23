import React, {useEffect} from "react";

type Props ={
    message: string;
    errorCode?: number;
    onClose: () => void;
};

const ErrorModal: React.FC<Props> = ({message, errorCode, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return(
        <div className = "error-modal-backdrop">
            <div className="error-modal">
                <button className="close-button" onClick={onClose}>x</button>
                    <img
                        src="../../assets/images/Error-Message.png"
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