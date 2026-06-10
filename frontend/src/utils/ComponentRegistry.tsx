import React from "react";

import {
    AdditionalCompetencies,
} from "../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";
import {BloomsTaxonomy} from "../screens/SyllabusView/Learning Outcomes/BloomsTaxonomy";

import OverviewComponent from "../components/SyllabusComponents/OverviewComponent";
import ActionButton from "../components/SyllabusComponents/ActionButton";
import Alert from "../components/SyllabusComponents/Alert";
import Image from "../components/SyllabusComponents/Image";
import Information from "../components/SyllabusComponents/Information";
import ParagraphFromFile from "../components/SyllabusComponents/ParagraphFromFile";
import {InformationTextComp} from "../components/SyllabusComponents/InformationTextComponent";

import AccordionWrapper from "../components/SyllabusComponents/ComponentWrappers/AccordionWrapper";
import ColumnWrapper from "../components/SyllabusComponents/ComponentWrappers/ColumnWrapper";
import RowWrapper from "../components/SyllabusComponents/ComponentWrappers/RowWrapper";
import CheckboxGroupWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxGroupWrapper";
import CheckboxWrapper from "../components/SyllabusComponents/ComponentWrappers/CheckboxWrapper";
import { CourseScheduleWrapper } from "../components/SyllabusComponents/ComponentWrappers/CourseScheduleWrapper";
import { SidebarLayoutWrapper } from "../components/SyllabusComponents/ComponentWrappers/SideBarWrapper";
import { GradeTableWrapper } from "../components/SyllabusComponents/ComponentWrappers/GradeTableWrapper";
import LearningOutcomesCardsWrapper from "../components/SyllabusComponents/ComponentWrappers/LearningOutcomesCardsWrapper";
import {FiveCoreCompetencies} from "../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";
import GradingPoliciesWrapper from "../components/SyllabusComponents/ComponentWrappers/GradingPoliciesWrapper";
import AssignmentsWrapper from "../components/SyllabusComponents/ComponentWrappers/AssignmentsWrapper";
import ChecklistComponentWrapper from "../components/SyllabusComponents/ComponentWrappers/ChecklistComponentWrapper";
import CompetencyTableWrapper from "../components/SyllabusComponents/ComponentWrappers/CompetencyTableWrapper";

import { FormInput } from "../components/SyllabusComponents/FormInput";
import { DropDownComponent } from "../components/SyllabusComponents/DropDownComponent";

import {
    AlertComponent,
    ButtonComponent,
    FormState,
    FormValue,
    ImageComponent,
    InformationComponent, InformationTextComponent,
    JsonComponent,
    ParagraphFromFileComponent,
} from "./types";

type RegistryComponentProps<T extends JsonComponent = JsonComponent> = {
    component: T;
    formData: FormState;
    onChange: (fieldId: string, value: FormValue) => void;
};

export const ComponentRegistry = {
    Accordion: AccordionWrapper,
    Column: ColumnWrapper,
    Row: RowWrapper,
    SidebarLayout: SidebarLayoutWrapper,

    text: FormInput,
    textarea: FormInput,
    select: DropDownComponent,
    CheckboxGroup: CheckboxGroupWrapper,
    checkbox: CheckboxWrapper,

    courseSchedule: CourseScheduleWrapper,
    GradeTable: GradeTableWrapper,
    GradingPolicies: GradingPoliciesWrapper,
    Assignments: AssignmentsWrapper,
    ChecklistComponent: ChecklistComponentWrapper,
    CompetencyTable1: CompetencyTableWrapper,
    CompetencyTable2: CompetencyTableWrapper,
    LearningOutcomesCards: LearningOutcomesCardsWrapper,
    FiveCoreCompetencies: ({ component }: any) => (
        <FiveCoreCompetencies five={component.competencies ?? []} />
    ),
    AdditionalCompetencies: () => <AdditionalCompetencies />,
    BloomsTaxonomy: () => <BloomsTaxonomy />,

    OverviewComponent: ({ formData }: RegistryComponentProps) => (
        <OverviewComponent formData={formData} />
    ),

    Button: ({ component }: RegistryComponentProps<ButtonComponent>) => (
        <ActionButton
            label={component.label || "Button"}
            variant={component.variant}
            href={component.href}
            new_tab={component.new_tab}
            modalCase={component.modalCase}
            modalProps={component.modalProps}
            externalLink={component.externalLink}
        />
    ),

    Alert: ({ component }: RegistryComponentProps<AlertComponent>) => (
        <Alert
            text={component.text || ""}
            file={component.file}
        />
    ),

    Image: ({ component }: RegistryComponentProps<ImageComponent>) => (
        <Image
            type={component.type}
            value={component.value}
            alt={component.alt}
            className={component.className}
        />
    ),

    Information: ({ component }: RegistryComponentProps<InformationComponent>) => (
        <Information text={component.text || ""} />
    ),

    informationText: ({component}: RegistryComponentProps<InformationTextComponent>) => (
        <InformationTextComp component = {component} placeholder = {component.placeholder ||" "} />
    ),

    paragraphFromFile: ({
                            component,
                        }: RegistryComponentProps<ParagraphFromFileComponent>) => (
        <ParagraphFromFile
            file={component.file}
            className={component.className}
            html={component.type === "htmlFromFile"}
        />
    ),

    htmlFromFile: ({
                       component,
                   }: RegistryComponentProps<ParagraphFromFileComponent>) => (
        <ParagraphFromFile
            file={component.file}
            className={component.className}
            html={component.type === "htmlFromFile"}
        />
    ),
};