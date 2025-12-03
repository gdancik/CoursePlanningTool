import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import SafeIcon from "../../../utils/ComponentWrapper";

interface CustomModalProps {
    visible: boolean;
    title?: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ 
    visible, 
    title, 
    children, 
    onClose 

}) => {
    if (!visible) return null;

    return (
        <div className = "custom-modal-backdrop">
            <div className="modal-window">
                <div className="modal-header">
                    <h2>
                        {title}
                        <SafeIcon Icon = {FaExternalLinkAlt} className="icon"/>
                    </h2>
                    <button onClick={onClose}>X</button>
                </div>

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>

    );
}
export default CustomModal;