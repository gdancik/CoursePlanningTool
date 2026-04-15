import AccordionWrapper from "../components/SyllabusComponents/ComponentWrappers/AccordionWrapper";
import ColumnWrapper from "../components/SyllabusComponents/ComponentWrappers/ColumnWrapper";
import RowWrapper from "../components/SyllabusComponents/ComponentWrappers/RowWarapper";
import CheckboxGroupWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxGroupWrapper";
import CheckboxWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxWrapper";

export const ComponentRegistry = {
    Accordion: AccordionWrapper,
    Column: ColumnWrapper,
    Row: RowWrapper,
    CheckBoxGroup: CheckboxGroupWrapper,
    checkbox: CheckboxWrapper
}