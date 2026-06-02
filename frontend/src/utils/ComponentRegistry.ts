import AccordionWrapper from "../components/SyllabusComponents/ComponentWrappers/AccordionWrapper";
import ColumnWrapper from "../components/SyllabusComponents/ComponentWrappers/ColumnWrapper";
import RowWrapper from "../components/SyllabusComponents/ComponentWrappers/RowWrapper";
import CheckboxGroupWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxGroupWrapper";
import CheckboxWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxWrapper";
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
import AlertWrapper from "../components/SyllabusComponents/ComponentWrappers/AlertWrapper";
import ImageWrapper from "../components/SyllabusComponents/ComponentWrappers/ImageWrapper";
import GradingPoliciesAdapter from "../components/SyllabusComponents/ComponentWrappers/GradingPoliciesWrapper";
import AssignmentsWrapper from "../components/SyllabusComponents/ComponentWrappers/AssignmentsWrapper";
import InformationWrapper from "../components/SyllabusComponents/ComponentWrappers/InformationWrapper";
import OverviewWrapper from "../components/SyllabusComponents/ComponentWrappers/OverviewWrapper";
import ChecklistComponentWrapper from "../components/SyllabusComponents/ComponentWrappers/ChecklistComponentWrapper";
import CompetencyTableWrapper from "../components/SyllabusComponents/ComponentWrappers/CompetencyTableWrapper";
export const ComponentRegistry = {
    Accordion: AccordionWrapper,
    Column: ColumnWrapper,
    Row: RowWrapper,
    CheckboxGroup: CheckboxGroupWrapper,
    checkbox: CheckboxWrapper,
    Alert: AlertWrapper,
    Information: InformationWrapper,
    Image: ImageWrapper,
    BloomsTaxonomy: BloomsTaxonomyWrapper,
    LearningOutcomesCards: LearningOutcomesCardsWrapper,
    GradingPolicies: GradingPoliciesAdapter,
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
    Assignments: AssignmentsWrapper,
    OverviewComponent: OverviewWrapper,
    ChecklistComponent: ChecklistComponentWrapper,
    CompetencyTable1: CompetencyTableWrapper,
    CompetencyTable2: CompetencyTableWrapper,

}