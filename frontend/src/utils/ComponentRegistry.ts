import AccordionWrapper from "../components/SyllabusComponents/ComponentWrappers/AccordionWrapper";
import ColumnWrapper from "../components/SyllabusComponents/ComponentWrappers/ColumnWrapper";
import RowWrapper from "../components/SyllabusComponents/ComponentWrappers/RowWrapper";
import CheckboxGroupWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxGroupWrapper";
import CheckboxWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxWrapper";
import Alert from "../components/SyllabusComponents/Alert";
import Information from "../components/SyllabusComponents/Information";
import {BloomsTaxonomy} from "../screens/SyllabusView/Learning Outcomes/BloomsTaxonomy";
import Image from "../components/SyllabusComponents/Image";
import {LearningOutcomesCards} from "../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";
import gradeTable from "../components/SyllabusComponents/Tables/gradeTable";
import GradingPolicies from "../components/SyllabusComponents/GradingPolicies";
import {FormInput} from "../components/SyllabusComponents/FormInput";
import {DropDownComponent} from "../components/SyllabusComponents/DropDownComponent";
import {ActionButtonWrapper} from "../components/SyllabusComponents/ComponentWrappers/ActionButtonWrapper";
import {InformationTextWrapper} from "../components/SyllabusComponents/ComponentWrappers/InformationTextWrapper";
import {ParagraphFromFileWrapper} from "../components/SyllabusComponents/ComponentWrappers/ParagraphFromFileWrapper";
import {CourseScheduleWrapper} from "../components/SyllabusComponents/ComponentWrappers/CourseScheduleWrapper";
import {SidebarLayoutWrapper} from "../components/SyllabusComponents/ComponentWrappers/SideBarWrapper";
import {GradeTableWrapper} from "../components/SyllabusComponents/ComponentWrappers/GradeTableWrapper";
import BloomsTaxonomyWrapper from "../components/SyllabusComponents/ComponentWrappers/BloomsTaxonomyWrapper";
import LearningOutcomesCardsWrapper
    from "../components/SyllabusComponents/ComponentWrappers/LearningOutcomesCardsWrapper";
import FiveCoreCompetenciesWrapper
    from "../components/SyllabusComponents/ComponentWrappers/FiveCoreCompetenciesWrapper";
import AdditionalCompetenciesWrapper
    from "../components/SyllabusComponents/ComponentWrappers/AdditionalCompetenciesWrapper";

export const ComponentRegistry = {
    Accordion: AccordionWrapper,
    Column: ColumnWrapper,
    Row: RowWrapper,
    CheckboxGroup: CheckboxGroupWrapper,
    checkbox: CheckboxWrapper,
    Alert,
    Information,
    Image,
    BloomsTaxonomy: BloomsTaxonomyWrapper,
    LearningOutcomesCards: LearningOutcomesCardsWrapper,
    GradingPolicies,
    text: FormInput,
    textarea: FormInput,
    select: DropDownComponent,
    Button: ActionButtonWrapper,
    informationText: InformationTextWrapper,
    paragraphFromFile: ParagraphFromFileWrapper,
    htmlFromFile: ParagraphFromFileWrapper,
    courseSchedule: CourseScheduleWrapper,
    SidebarLayout: SidebarLayoutWrapper,
    GradeTable:GradeTableWrapper,
    FiveCoreCompetencies: FiveCoreCompetenciesWrapper,
    AdditionalCompetencies: AdditionalCompetenciesWrapper,
}