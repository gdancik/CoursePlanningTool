import AccordionWrapper from "../components/SyllabusComponents/ComponentWrappers/AccordionWrapper";
import ColumnWrapper from "../components/SyllabusComponents/ComponentWrappers/ColumnWrapper";
import RowWrapper from "../components/SyllabusComponents/ComponentWrappers/RowWrapper";
import CheckboxGroupWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxGroupWrapper";
import CheckboxWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxWrapper";
import Alert from "../components/SyllabusComponents/Alert";
import Information from "../components/SyllabusComponents/Information";
import {BloomsTaxonomy} from "../screens/SyllabusView/Learning Outcomes/BloomsTaxonomy";
import {LearningOutcomesCards} from "../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";

export const ComponentRegistry = {
    Accordion: AccordionWrapper,
    Column: ColumnWrapper,
    Row: RowWrapper,
    CheckBoxGroup: CheckboxGroupWrapper,
    checkbox: CheckboxWrapper,
    Alert: Alert,
    Information: Information,
    Image: Image,
    BloomsTaxonomy: BloomsTaxonomy,

}