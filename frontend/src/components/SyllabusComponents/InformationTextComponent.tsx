import React from "react"
import {InformationTextComponent} from "../../utils/PageRenderEngine/types";

interface InfoTextCompProps {
    component: InformationTextComponent;
    placeholder?: string,
}


export const InformationTextComp: React.FC<InfoTextCompProps> = ({
    component,
    placeholder
}) => {
    return (
        <div>
            <p>{component.placeholder ?? placeholder}</p>
        </div>
    )
}