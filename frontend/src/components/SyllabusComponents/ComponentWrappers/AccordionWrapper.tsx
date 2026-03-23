import SectionAccordion from "../../../screens/SyllabusView/BasicInformation/SectionAccordion";
import {JsonRenderComponent} from "../../../utils/jsonRenderer";
import {AccordionComponent} from "../../../utils/types";

type Props = {
    component: AccordionComponent;
    formData: Record <string, string>;
    onChange: (label: string, value: string) => void;
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