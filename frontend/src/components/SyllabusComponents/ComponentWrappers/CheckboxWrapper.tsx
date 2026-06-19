import Checkbox from "../Checkbox";
import {
    FormState,
    FormValue,
    CheckboxComponent,
} from "../../../utils/PageRenderEngine/types";

type Props = {
    component: CheckboxComponent;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export default function CheckboxWrapper({
                                            component,
                                            formData,
                                            onChange,
                                        }: Props) {
    const fieldId = component.id;
    const rawValue = formData[fieldId];

    const checked = rawValue === true || rawValue === "true";

    return (
        <Checkbox
            id={fieldId}
            label={component.label}
            className={component.className}
            checked={checked}
            onChange={(checked) => onChange(fieldId, checked)}
        />
    );
}