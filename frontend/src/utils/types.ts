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
    imageType?: "file" | "url";
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
export interface BloomsTaxonomy extends BaseComponent {
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
    sideBarContent?: JsonComponent[];
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





