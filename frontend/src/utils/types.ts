/* Types.TS - All Type components currently used */

import {JsonComponent} from "./jsonRenderer";

export type ComponentTypes =
    | "Accordion"
    | "Column"
    | "Row"
    | "CheckBoxGroup"
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
/*    Base Components + Shared Ones    */
/* =================================== */

//BaseComponent Across all Components

export interface BaseComponents {
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
export interface withContent {
    content?: JsonComponent[];
}

export interface WithConditional {
    conditional?: {
        field: string;
        value?: string;
    }
}


