import React from "react";
import Alert from "../Alert";
import {
    AlertComponent,
    FormState,
    FormValue,
} from "../../../utils/types";

type Props = {
    component: AlertComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function AlertWrapper({ component }: Props) {
    return (
        <Alert
            text={component.text || ""}
            file={component.file}
        />
    );
}
