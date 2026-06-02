import React from "react";
import Information from "../Information";
import {
    InformationComponent,
    FormState,
    FormValue,
} from "../../../utils/types";

type Props = {
    component: InformationComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function InformationWrapper({ component }: Props) {
    return <Information text={component.text || ""} />;
}