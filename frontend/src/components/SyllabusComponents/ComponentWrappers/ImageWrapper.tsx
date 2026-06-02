import React from "react";
import Image from "../Image";
import {
    ImageComponent,
    FormState,
    FormValue,
} from "../../../utils/types";

type Props = {
    component: ImageComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function ImageWrapper({ component }: Props) {
    return (
        <Image
            type={component.type}
            value={component.value}
            alt={component.alt}
            className={component.className}
        />
    );
}