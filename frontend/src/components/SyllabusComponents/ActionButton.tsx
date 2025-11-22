import ReusableButton from "../Button/ReusableButton";
import { useModalFactory
 } from "../../utils/useModalFactory";

 interface ActionButtonProps {
    label: string;
    href?: string;
    modalCase?: string;
    modalProps?: any;
    variant?: "primary" | "secondary" | "exit" | "green";
    className?: string;
 }

 const ActionButton: React.FC<ActionButtonProps> = ({
    label,
    href,
    modalCase,
    modalProps,
    variant = "primary",
    className
 }) => {
    const modal = useModalFactory();

    const handleClick = () => {
        if(href) {
            window.location.href = href;
            return;
        }
        if(modalCase) {
            modal.showCustomModal(modalCase, modalProps);
            return;
        }
    };

    return (
        <ReusableButton
            label={label}
            onClick={handleClick}
            variant={variant}
            className={className}
        />
    );
 };

 export default ActionButton;