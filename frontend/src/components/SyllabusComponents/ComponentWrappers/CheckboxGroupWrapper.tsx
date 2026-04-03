import React from "react";
import {JsonRenderComponent} from "../../../utils/jsonRenderer";
import {CheckboxGroupComponent} from "../../../utils/types";

type Props = {
    component: CheckboxGroupComponent
    formData: Record<string, string>
    onChange: string[]
    value?: string
}