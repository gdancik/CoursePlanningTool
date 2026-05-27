import React from "react";
import ActionButton from "../ActionButton";
import {ButtonComponent} from "../../../utils/types";

interface ActionButtonWrapperProps {
    component: ButtonComponent;
}

export const ActionButtonWrapper: React.FC<ActionButtonWrapperProps> = ({
    component,
}) => {
    return (
        <ActionButton
            label={component.label || "Button"}
            variant={component.variant}
            href={component.href}
            new_tab={component.new_tab}
            modalCase={component.modalCase}
            modalProps={component.modalProps}
            externalLink={component.externalLink}

        />
    );
}