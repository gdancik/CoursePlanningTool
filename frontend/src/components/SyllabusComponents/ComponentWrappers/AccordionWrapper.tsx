import SectionAccordion from "../SectionAccordion";
import {JsonRenderComponent} from "../../../utils/PageRenderEngine/jsonRenderer";
import {AccordionComponent, FormState, FormValue} from "../../../utils/PageRenderEngine/types";

type Props = {
    component: AccordionComponent;
    formData: FormState;
    onChange: (label: string, value: FormValue) => void;
}

export default function AccordionWrapper ({component, formData, onChange} : Props) {
    return (
        <SectionAccordion sectionName={component.title || ""} formData={formData} onFieldChange={onChange}>
            {component.content?.map((child, i) =>
                <div key={i}>
                    <JsonRenderComponent component = {child} formData = {formData} onChange = {onChange}/>
                </div>
            )}
        </SectionAccordion>
    )
}