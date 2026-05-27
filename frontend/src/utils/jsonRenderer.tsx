import React from "react";

import ParagraphFromFile, {HTMLFromFile} from "../components/SyllabusComponents/ParagraphFromFile";
import CourseSchedule from "../components/SyllabusComponents/Tables/courseSchedule";
import SidebarLayout from "../components/SidebarLayout";
import Assignments from "../components/SyllabusComponents/Assignments";
import GradeTable from "../components/SyllabusComponents/Tables/gradeTable";
import { CardData } from "../components/SyllabusComponents/ContentCardSet";
import ActionButton from "../components/SyllabusComponents/ActionButton";
import OverviewComponent from "../components/SyllabusComponents/OverviewComponent";
import ChecklistComponent from "../components/SyllabusComponents/ChecklistComponent"
import { CoreCompetencyInterface, FiveCoreCompetencies, AdditionalCompetencies, 
         LearningOutcomesCards } from "../screens/SyllabusView/Learning Outcomes/LearningOutcomesComponents";
import {GradingPolicies} from "../components/SyllabusComponents/GradingPolicies"

import CompetencyTable1 from "../components/SyllabusComponents/Tables/CompetencyTable1"
import CompetencyTable2 from "../components/SyllabusComponents/Tables/CompetencyTable2"

import {ComponentRegistry} from "./ComponentRegistry";
import {FormState, FormValue} from "./types";
import {AccordionComponent, CheckboxComponent, CheckboxGroupComponent, ColumnComponent, RowComponent,
    AlertComponent, ImageComponent,
    InformationComponent,GradingPoliciesComponent,LearningOutcomesComponent, TextInputComponent, TextAreaComponent} from "./types";

// Type for JSON-driven UI
export type JsonComponent = {
    type: string;
    title?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    className?: string;
    informationText?: string;
    file?: string;
    variant?: "primary" | "secondary" | "exit" | "green";
    href?: string;
    externalLink?: boolean;
    new_tab?: boolean
    modalCase?: string;
    modalProps?: any;

    // for text boxes
    maxLength?: number;

    sidebarClassName?: string;
    contentClassName?: string;
    sidebarContent?: JsonComponent[];
    sidebarWidth?: string;
    accentColor?: string;
    borderColor?: string;

    value?: string;
    alt?: string;

    content?: JsonComponent[];
    text?: string;
    data?: string[];
    horizontal?: boolean;
    conditional?: {
        field: string;
        value?: string;
    };

    // for five core competencies
    competencies?: CoreCompetencyInterface[] | undefined;

    // required for courseSchedule
    term?: string;   // field that includes the term
    year?: string;   // field that includes the year
    days1?: string   // field for days1
    days2?: string   // field for days2
};

interface JsonRenderComponentProps {
  component: JsonComponent;
  formData: FormState;
  onChange: (label: string, value: FormValue) => void;
}

const JsonRenderComponentInner: React.FC<JsonRenderComponentProps> = ({
  component,
  formData,
  onChange
}) => {
    const onStringChange = (fieldId: string, value: string) => {
        onChange(fieldId, value);
    };
    function isCardDataArray(value: unknown): value is CardData[] {
        return (
            Array.isArray(value) &&
            value.every(item =>
                typeof item === "object" &&
                item !== null &&
                typeof (item as CardData).title === "string"
            )
        );
    }

    function isStringPairArray(value: unknown): value is [string, string][] {
        return (
            Array.isArray(value) &&
            value.every(
                item =>
                    Array.isArray(item) &&
                    item.length === 2 &&
                    typeof item[0] === "string" &&
                    typeof item[1] === "string"
            )
        );
    }

    switch (component.type) {
        case "Accordion": {
            const Component = ComponentRegistry["Accordion"];

            if (!Component) {
                console.error("Accordion not found in registry");
                return null;
            }

            return (
                <Component
                    component={component as AccordionComponent}
                    formData={formData}
                    onChange={onChange}
                />
            );
        }


        case "Column": {
            const Component = ComponentRegistry["Column"];

            if (!Component) {
                console.error("Column not found in registry");
                return null;
            }

            return (
                <Component
                    component={component as ColumnComponent}
                    formData={formData}
                    onChange={onChange}
                />
            );
        }

        case "Row": {
            const Component = ComponentRegistry["Row"];

            if (!Component) {
                console.error("Row not found in registry");
                return null;
            }

            return (
                <Component
                    component={component as RowComponent}
                    formData={formData}
                    onChange={onChange}
                />
            )
    }
        case "CheckboxGroup": {
            const Component = ComponentRegistry["CheckBoxGroup"];

            if (!Component) {
                console.error(Component + "Not found in Registry");
                return null;
            }

            return (
                <Component
                    component={component as CheckboxGroupComponent}
                    formData={formData}
                    onChange={onChange}
                />
            );
        }
        case "checkbox": {
            const Component = ComponentRegistry["checkbox"];

            if (!Component) {
                console.error(Component + "not found in registry");
                return null;
            }
            return (
                <Component
                    component={component as CheckboxComponent}
                    formData={formData}
                    onChange={onChange}
                />
            );
        }

        case "Alert": {
            const Component = ComponentRegistry["Alert"];
            const alertComponent =  component as AlertComponent;
            if (!Component) {
                console.error(Component + "Not found in Registry");
                return null;
            }
            return <Component text={alertComponent.text || ""} file={alertComponent.file}/>
        }

        case "Information": {
            const Component = ComponentRegistry["Information"];
            const infoComponent =  component as InformationComponent;
            if (!Component) {
                console.error(Component + "Not found in Registry");
                return null;
            }
            return <Component text={infoComponent.text || ""}/>
        }

        case "Image": {
            const Component = ComponentRegistry["Image"];


            if (!Component) {
                console.error("Image not found in registry");
                return null;
            }

            const imageComponent  = component as ImageComponent
            return (
                <Component type ={imageComponent.type} value ={imageComponent.value} alt = {imageComponent.alt}  className = {imageComponent.className}/>
            )
        }

        case "BloomsTaxonomy": {
            const Component = ComponentRegistry ["BloomsTaxonomy"];

            return <Component/>
        }

        case "LearningOutcomesCards": {
            const Component = ComponentRegistry["LearningOutcomesCards"];

            if (!Component) {
                console.error("LearningOutcomesCards not found in registry");
                return null;
            }

            // 1. Narrow down to your precise interface from types.ts
            const loComponent = component as LearningOutcomesComponent;

            if (!loComponent.id) {
                console.error("LearningOutcomesCards requires an 'id'");
                return null;
            }

            // 2. Fetch raw state data directly using the typed ID key
            const rawData = formData[loComponent.id];
            const currentCards = isCardDataArray(rawData) ? rawData : [];

            return (
                <Component
                    id={loComponent.id}
                    data={currentCards}
                />
            );
        }

        case "GradingPolicies": {

            const Component = ComponentRegistry["GradingPolicies"]
            const grdPolComponent = component as GradingPoliciesComponent
            if (!component.id) {
                console.error("GradingPolicies component requires an 'id'");
                return null;
            }

            const GP_raw = formData[component.id];

            const GPData: CardData[] = isCardDataArray(GP_raw) ? GP_raw: [];

            return (
                <Component
                    id={grdPolComponent.id}
                    data={GPData}
                />
            );
        }
        // Text-like inputs

        case "text":
        case "textarea": {
            const Component = ComponentRegistry[component.type];

            if (!Component) {
                console.error(`${component.type} not found in registry`);
                return null;
            }

            return (
                <Component
                    component={component as TextInputComponent | TextAreaComponent}
                    formData={formData}
                    onChange={onStringChange}
                />
            );
        }

        // Dropdown
        case "select": {
            if (component.id === undefined || typeof component.id !== "string") {
                alert("component.id needed for select component");
                return null;
            }

            const select_id = component.id;
            const rawValue = formData[select_id];

            const selectValue =
                typeof rawValue === "string" || typeof rawValue === "number"
                    ? rawValue
                    : "";

            return (
                <label key={select_id} className={component.className || ""}>
                    {component.label}
                    <select
                        id={select_id}
                        value={selectValue}
                        onChange={(e) => {
                            onChange(select_id, e.target.value);
                        }}
                        required={component.required}
                        className={component.className || ""}
                    >
                        <option value="">Select</option>
                        {component.options?.map((opt, i) => (
                            <option key={select_id + i} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </label>
            );
        }

        case "Assignments": {
            if (!component.id) {
                console.error("Assignments component requires an 'id'");
                return null;
            }

            const assignment_raw = formData[component.id];

            const AssignmentData: CardData[] = isCardDataArray(assignment_raw)
                ? assignment_raw
                : [];

            return (
                <Assignments
                    id={component.id}
                    data={AssignmentData}
                />
            );
        }
        // Textarea
            case "informationText":
                return (
                    component.placeholder ? (
                    <p>{component.placeholder}</p>
                    ) : (
                    <p><br/></p>
                    )
                );

            case "paragraphFromFile" :               
                return (
                    <ParagraphFromFile file = {component.file || ""} 
                       className = {component.className || undefined}/>                                                            
                )  
            
            case "htmlFromFile" :
                return (
                    <ParagraphFromFile 
                       file = {component.file || ""} 
                       className = {component.className || undefined}
                       html = {true}/>                                                            
                )  

            case "courseSchedule" :           
            
                if (component.id === undefined) {
                    alert('courseSchedule component needs an id');
                    return null;
                }

                const courseScheduleData = formData[component.id];

                if (component.term === undefined || component.year === undefined || component.days1 == undefined) {
                    alert('Must specify term, year, and days fields for courseSchedule component');
                    return null;
                    
                }
          
                const days_to_string = function(x: any, name: string) {
                    if (x === undefined) {
                        return x;
                    }                    
                    if (Array.isArray(x)) {
                        return x.join('');
                    } else {
                        alert("Error: " + name + " must correspond to an array")
                    return x;
                    }
                }

                const term = formData[component.term];
                const year = formData[component.year];
                let days = days_to_string(formData[component.days1], 'days1');
                
                if (component.days2) {
                    const days2 = days_to_string(formData[component["days2"]], 'days2'); 
                    const removeDuplicates = (str:string) => [...new Set(str)].join('');
                    days = removeDuplicates(days +days2);
                }                

                

                return (
                    <CourseSchedule 
                        id={component.id} 
                        term={term} 
                        year={year}
                        days={days}
                        data={courseScheduleData}
                    />
                )   
            case "SidebarLayout":
                //let children = <p>Hi <b>there</b></p>

                // this is the body of the main panel
                let children = component.content?.map((child, i) => (
                            <div key={i}>
                                <JsonRenderComponent component = {child} formData = {formData} onChange = {onChange}/>
                            </div>
                ))    
                              
                // sidebar content (left panel) can be a string (text or informationText)
                let sidebarContent: React.ReactNode = component.text || component.informationText || undefined
                            
                // if undefined, then treat as list of objects                                            
                sidebarContent = component.sidebarContent?.map((child, i) => (
                            <div key={i}>
                                <JsonRenderComponent component = {child} formData = {formData} onChange = {onChange}/>
                            </div>
                ))
                            
                return (
                    <SidebarLayout
                    sidebarTitle={component.title || ""}
                    sidebarContent={sidebarContent}

                    className = {component.className || ""}
                    sidebarClassName={component.sidebarClassName || ""}
                    contentClassName={component.contentClassName || ""}
                    sidebarWidth={component.sidebarWidth || "300px"}   
                    children = {children}
                                
                    />
                )
        case "GradeTable": {
            if (!component.id) {
                alert("GradeTable component requires an id");
                return null;
            }

            const rawValue = formData[component.id];

            let gradeTable: [string, string][] = [];

            if (isStringPairArray(rawValue)) {
                gradeTable = rawValue;
            } else if (typeof rawValue === "string") {
                try {
                    const parsedTable: unknown = JSON.parse(rawValue);

                    if (isStringPairArray(parsedTable)) {
                        gradeTable = parsedTable;
                    }
                } catch {
                    gradeTable = [];
                }
            }

            return (
                <GradeTable
                    id={component.id}
                    data={gradeTable}
                />
            );
        }

            case "Button":
                return (
                    <ActionButton
                        label={component.label || "Button"}
                        variant={component.variant}
                        href={component.href}
                        new_tab={component.new_tab}
                        modalCase={component.modalCase}
                        modalProps={component.modalProps}
                        externalLink={component.externalLink}

                    />
                );

            case "OverviewComponent": 
                return (
                    <OverviewComponent formData={formData}/>
                )
            case "ChecklistComponent": 
                return (
                    <ChecklistComponent formData={formData} 
                    additional_sections_id="additional_sections_syllabus_json"
                    policy_checkboxes_id="policy_checkboxes"
                    resources_checkboxes_id="resources_checkboxes"/>
                )

            case "FiveCoreCompetencies" :              
                return <FiveCoreCompetencies five = {component.competencies ?? []}/>
            
            case "AdditionalCompetencies" :
                return <AdditionalCompetencies/>

            case "CompetencyTable1" :
                                    
                if (component.id === undefined) {
                    alert('CompetencyTable1 needs an id');
                    return null;                    
                }

                const competencyData1String = formData[component.id];  
                                          
                if (typeof(competencyData1String) == 'string') {                    
                    return <CompetencyTable1 id = {component.id} 
                                             data = {JSON.parse(competencyData1String.trim())}/>
                } else if (competencyData1String === undefined) {
                    return <CompetencyTable1 id = {component.id}/>
                } else {                
                    alert("Error: competencyData1 is not valid")       
                    return null;      
                }

            case "CompetencyTable2" :                
                if (component.id === undefined) {
                    alert('CompetencyTable2 needs an id');
                    return null;
                    
                }                

                const competencyData2String = formData[component.id];  
                                          
                if (typeof(competencyData2String) == 'string') {                    
                    return <CompetencyTable2 id = {component.id} 
                                             data = {JSON.parse(competencyData2String.trim())}/>
                } else if (competencyData2String === undefined) {
                    return <CompetencyTable2 id = {component.id}/>
                } else {                
                    alert("Error: competencyData2 is not valid")       
                    return null;      
                }
                

        default:
            alert('Unknown type in json: ' + component.type )
            return null;
    }
}

// We use React.memo to prevent re-rendering when no props change. This was only an issue with the 
// <select element>, which did not update on the first change
export const JsonRenderComponent = React.memo(JsonRenderComponentInner);
