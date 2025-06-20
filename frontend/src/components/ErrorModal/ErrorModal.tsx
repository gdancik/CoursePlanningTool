import React, {useEffect} from "react";

type Props ={
    message: string;
    onClose: () => void;
};

const ErrorModal: React.FC<Props> = ({message, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return(
        <div className="New-Class">
            <strong>Error:</strong> {message}
        </div>
    );
};

export default ErrorModal;