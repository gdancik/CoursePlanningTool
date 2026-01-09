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
    new_tab?: boolean;
    externalLink?: boolean;
 }

 const ActionButton: React.FC<ActionButtonProps> = ({
    label,
    href,
    modalCase,
    modalProps,
    variant = "secondary",
    className,
    new_tab = false,
    externalLink = false
 }) => {
    const modal = useModalFactory();

    const handleClick = () => {
        if(href) {
            if (new_tab) {
                window.open(href, '_blank', 'noopener,noreferrer')
            } else {
                window.location.href = href;
            }
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
            externalLink={externalLink}
            variant={variant}
            className={className}
        />
    );
 };

 export default ActionButton;