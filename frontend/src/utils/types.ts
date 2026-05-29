/* Types.TS - All Type components currently used */
import {CardData} from "../components/SyllabusComponents/ContentCardSet";

export type ComponentTypes =
    | "Accordion"
    | "Column"
    | "Row"
    | "CheckboxGroup"
    | "checkbox"
    | "Alert"
    | "Information"
    | "Image"
    | "BloomsTaxonomy"
    | "LearningOutcomesCards"
    | "GradingPolicies"
    | "text"
    | "select"
    | "Assignments"
    | "textarea"
    | "informationText"
    | "paragraphFromFile"
    | "htmlFromFile"
    | "courseSchedule"
    | "SidebarLayout"
    | "GradeTable"
    | "Button"
    | "OverviewComponent"
    | "ChecklistComponent"
    | "FiveCoreCompetencies"
    | "AdditionalCompetencies"
    | "CompetencyTable1"
    | "CompetencyTable2"

/* =================================== */
/*    FormData Specification Type      */
/* =================================== */


export type FormValue =
    | string
    | string[]
    | boolean
    | CardData[]
    | [string,string][]
    | number
    | undefined

export type FormState = Record<string, FormValue>;


/* =================================== */
/*    FormValue Specification Type     */
/* =================================== */


/* =================================== */
/*    Base Components + Shared Ones    */
/* =================================== */

//BaseComponent Across all Components

export interface BaseComponent {
    type: ComponentTypes;
    className?: string;
}

//Component ID mixin
export interface WithId {
    id: string;
}

//Component Label mixin
export interface WithLabel {
    label?: string;
}

//Placeholder Mixin
export interface WithPlaceholder {
    placeholder?: string;
}

//Required checks Mixin
export interface WithRequired {
    required?: boolean;
}

//WithContent Mixin
export interface WithContent {
    content?: JsonComponent[];
}

export interface WithConditional {
    conditional?: {
        field: string;
        value?: string;
    }
}


/* =================================== */
/*     Presentational Components       */
/* =================================== */

export interface ImageComponent extends BaseComponent {
    type: "Image";
    value: string;
    alt?: string;
}

export interface AlertComponent extends BaseComponent {
    type: "Alert";
    text: string;
    file?: string;
}

export interface InformationComponent extends BaseComponent {
    type: "Information";
    text: string;
}
export interface BloomsTaxonomyComponent extends BaseComponent {
    type: "BloomsTaxonomy";
}

export interface AdditionalCompetenciesComponent extends BaseComponent {
    type: "AdditionalCompetencies";
}

/* =================================== */
/*        Container Components         */
/* =================================== */

export interface AccordionComponent extends BaseComponent, WithContent {
    type: "Accordion";
    title: string;
}

export interface ColumnComponent extends BaseComponent, WithContent, WithConditional {
    type: "Column";
    id?: string;
}
export interface RowComponent extends BaseComponent, WithConditional, WithContent {
    type: "Row";
    id?: string;
}

export interface SidebarLayoutComponent extends BaseComponent, WithContent {
    type: "SidebarLayout";
    title?: string;
    sidebarContent?: JsonComponent[];
    sidebarWidth?: string;
    sidebarClassName?: string;
    contentClassName?: string;
    text?: string;
    informationText?: string;
}

/* =================================== */
/*           Input Components          */
/* =================================== */

export interface TextInputComponent extends BaseComponent, WithId, WithLabel, WithPlaceholder, WithRequired {
    type: "text";
    maxLength?: number;
}

export interface TextAreaComponent extends BaseComponent, WithId, WithLabel, WithPlaceholder, WithRequired {
    type: "textarea";
    maxLength?: number;
}

export interface SelectComponent extends BaseComponent, WithId, WithLabel, WithRequired {
    type: "select";
    options?: string[];
}

export interface CheckboxComponent extends BaseComponent, WithId, WithLabel {
    type: "checkbox";
}

export interface CheckboxGroupComponent extends BaseComponent, WithId, WithLabel {
    type: "CheckboxGroup";
    data: string[];
    horizontal?: boolean;
}
/* ========================= */
/* DATA / COMPLEX COMPONENTS */
/* ========================= */

export interface AssignmentsComponent extends BaseComponent, WithId {
    type: "Assignments";
}

export interface GradeTableComponent extends BaseComponent, WithId{
    type: "GradeTable"
}

export interface CourseScheduleComponent extends BaseComponent, WithId {
    type: "courseSchedule",
    term: string;
    year: string;
    days1: string;
    days2?: string;
}

export interface LearningOutcomesComponent extends BaseComponent, WithId {
    type: "LearningOutcomesCards";
}

export interface GradingPoliciesComponent extends BaseComponent, WithId {
    type: "GradingPolicies";
}

/* ========================= */
/*   FILE-BASED COMPONENTS   */
/* ========================= */

export interface ParagraphFromFileComponent extends BaseComponent {
    type: "paragraphFromFile" | "htmlFromFile";
    file: string;
}


/* ========================= */
/*            Misc.          */
/* ========================= */

export interface InformationTextComponent extends BaseComponent {
    type: "informationText";
    placeholder?: string;
}

export interface ButtonComponent extends BaseComponent, WithLabel {
    type: "Button";
    variant?: "primary" | "secondary" | "exit" | "green";
    href?: string;
    externalLink?: boolean;
    new_tab?: boolean;
    modalCase?: string;
    modalProps?: any;
}
export interface OverviewComponentType extends BaseComponent {
    type: "OverviewComponent";
}

export interface ChecklistComponentType extends BaseComponent {
    type: "ChecklistComponent";
}

export interface FiveCoreCompetenciesComponent extends BaseComponent {
    type: "FiveCoreCompetencies";
    competencies?: any[]; // refine later if needed
}

export interface CompetencyTable1Component
    extends BaseComponent,
        WithId {
    type: "CompetencyTable1";
}

export interface CompetencyTable2Component
    extends BaseComponent,
        WithId {
    type: "CompetencyTable2";
}

/* ========================= */
/*      JSON Engine Type     */
/* ========================= */

export type JsonComponent =
    | ImageComponent
    | AlertComponent
    | InformationComponent
    | BloomsTaxonomyComponent
    | AdditionalCompetenciesComponent
    | AccordionComponent
    | ColumnComponent
    | RowComponent
    | SidebarLayoutComponent
    | TextInputComponent
    | TextAreaComponent
    | SelectComponent
    | CheckboxComponent
    | CheckboxGroupComponent
    | AssignmentsComponent
    | GradeTableComponent
    | CourseScheduleComponent
    | LearningOutcomesComponent
    | GradingPoliciesComponent
    | ParagraphFromFileComponent
    | InformationTextComponent
    | ButtonComponent
    | OverviewComponentType
    | ChecklistComponentType
    | FiveCoreCompetenciesComponent
    | CompetencyTable1Component
    | CompetencyTable2Component;