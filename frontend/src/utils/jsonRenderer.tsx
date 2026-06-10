import React from "react";

import { ComponentRegistry } from "./ComponentRegistry";
import {
    FormState,
    FormValue,
    JsonComponent,
} from "./types";

interface JsonRenderComponentProps {
    component: JsonComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
}

const JsonRenderComponentInner: React.FC<JsonRenderComponentProps> = ({
                                                                          component,
                                                                          formData,
                                                                          onChange,
                                                                      }) => {
    const Component =
        ComponentRegistry[component.type as keyof typeof ComponentRegistry];

    if (!Component) {
        console.error(`${component.type} not found in registry`);
        return null;
    }

    return (
        <Component
            component={component as never}
            formData={formData}
            onChange={onChange}
        />
    );
};

export const JsonRenderComponent = React.memo(JsonRenderComponentInner);