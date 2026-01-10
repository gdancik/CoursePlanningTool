import React from "react";
import SectionAccordion from "../screens/SyllabusView/BasicInformation/SectionAccordion";
import CheckboxGroup from "../components/SyllabusComponents/CheckboxGroup";
import Alert from "../components/SyllabusComponents/Alert";
import Image from "../components/SyllabusComponents/Image";
import Information from "../components/SyllabusComponents/Information";
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
import { BloomsTaxonomy} from "../screens/SyllabusView/Learning Outcomes/BloomsTaxonomy"

import CompetencyTable1 from "../components/SyllabusComponents/Tables/CompetencyTable1"
import CompetencyTable2 from "../components/SyllabusComponents/Tables/CompetencyTable2"

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

// Recursive renderer
export function jsonRenderComponent(
    component: JsonComponent,
    formData: Record<string, string>,
    onChange: (label: string, value: string) => void
): React.ReactNode {
    switch (component.type) {
        case "Accordion":
            return (
                <SectionAccordion
                    sectionName={component.title || ""}
                    formData={formData}
                    onFieldChange={onChange}
                >
                    {component.content?.map((child, i) => (
                        <div key={i}>
                            {jsonRenderComponent(child, formData, onChange)}
                        </div>
                    ))}
                </SectionAccordion>
            );

        case "Column":
            if (component.conditional) {
                const fieldValue = formData[component.conditional.field];
                const requiredValue = component.conditional.value;

            
                if (requiredValue === undefined) {
                    if (!fieldValue) return null;
                } else {
                    if (fieldValue !== requiredValue) return null;
                }
            }

            return (
            <div 
            key={component.id} 
            className={component.className || "form-column"}
            >
                    {component.content?.map((child, i) =>
                        jsonRenderComponent(child, formData, onChange)
                    )}
                </div>
            );

        case "Row":
            // Handle conditional logic for rows
            if (component.conditional) {
                const fieldValue = formData[component.conditional.field];
                const requiredValue = component.conditional.value;

                // If no specific value is required, just check truthiness
                if (requiredValue === undefined) {
                    if (!fieldValue) return null;
                } else {
                    if (fieldValue !== requiredValue) return null;
                }
            }

            return (
            <div key={component.id} className={component.className || "form-row"}>
                    {component.content?.map((child, i) =>
                        jsonRenderComponent(child, formData, onChange)
                    )}
                </div>
            );

        case "CheckboxGroup":
            const fieldId = component.id || "";
            const rawValue = formData[fieldId];
            let currentValue: string [] = []
            if(Array.isArray(rawValue)) {
                currentValue = rawValue;
            } else if (typeof rawValue === "string") {
                try{
                    const parsed = JSON.parse(rawValue);
                    if(Array.isArray (parsed)) currentValue = parsed;
                    else currentValue = rawValue.split(",").filter(Boolean);
                }catch {
                    currentValue = rawValue.split(",").filter(Boolean);
                }
            }
            return (
                <div key = {component.id}>
                    <CheckboxGroup 
                    label = {component.label}
                    id = {component.id}
                    data = {component.data || []}
                    className = {component.className}
                    horizontal = {component.horizontal ?? true}
                    value = {currentValue}
                    onChange={(vals: string[]) => onChange(fieldId, JSON.stringify(vals))}
                    />
                </div>
            );
        case "checkbox":
            return (
                <label className={component.className || ""}>
                    <input
                        type="checkbox"
                        id={component.id}
                        checked={!!formData[component.id || ""]}
                        onChange={(e) =>
                            onChange(
                                component.id || "",
                                e.target.checked ? "true" : ""
                            )
                        }
                    />
                    {component.label}
                </label>
            );

        case "Alert":
            return <Alert text={component.text || ""} file = {component.file} />;

        case "Information":
            return <Information text={component.text || ""} />;

        case "Image":
            return <Image type = "file" value={component.value} alt={component.alt} />
           
        case "BloomsTaxonomy":
            return <BloomsTaxonomy/>
        
        case "LearningOutcomesCards" :
            if (!component.id) {
                console.error("Assignments component requires an 'id'");
                return null;
            }


            const LO_raw = formData[component.id];        
            const LearningOutcomesData: CardData[] = Array.isArray(LO_raw) ? LO_raw : [];
            //console.log("passing data = " + LearningOutcomesData);
            //console.log(LearningOutcomesData);
            return <LearningOutcomesCards id = {component.id} data = {LearningOutcomesData}/>            
        // Text-like inputs

        case "text":
            return (
                <label key={component.id} className={component.className || ""}>
                    {component.label}
                    <input
                        id={component.id || component.label || ""}
                        type={component.type}
                        placeholder={component.placeholder}
                        value={
                            formData[component.id || component.label || ""] ||
                            ""
                        }
                        onChange={(e) =>
                            onChange(component.id || "", e.target.value)
                        }
                        required={component.required}
                        className={component.className || ""}
                    />
                </label>
            );

        // Dropdown
        case "select":
            return (
                <label key={component.id} className={component.className || ""}>
                    {component.label}
                    <select
                        id={component.id || component.label || ""}
                        value={
                            formData[component.id || component.label || ""] ||
                            ""
                        }
                        onChange={(e) =>
                            onChange(component.id || "", e.target.value)
                        }
                        required={component.required}
                        className={component.className || ""}
                    >
                        <option value="">Select</option>
                        {component.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </label>
            );


            case "Assignments": 
        
            if (!component.id) {
                console.error("Assignments component requires an 'id'");
                return null;
            }
       
            const assignment_raw = formData[component.id];
            
            const AssignmentData: CardData[] = Array.isArray(assignment_raw) ? assignment_raw : [];

                return (
                    <Assignments
                    id={component.id}
                    data={AssignmentData}                                         
                />
            );

        // Textarea
        case "textarea":
            return (
                <label key={component.id} className={component.className || ""}>
                    {component.label}
                    {component.placeholder && (
                        <p>
                            {component.placeholder}
                        </p>
                    )}
                    <textarea
                        id={component.id || component.label || ""}
                        value={
                            formData[component.id || component.label || ""] ||
                            ""
                        }
                        onChange={(e) =>
                            onChange(component.id || "", e.target.value)
                        }
                        required={component.required}
                        className={component.className || ""}
                    />
                </label>
            );

            case "informationText":
                return (
                    <p >{component.placeholder}</p>

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
                                {jsonRenderComponent(child, formData, onChange)}
                            </div>
                ))    
                              
                // sidebar content (left panel) can be a string (text or informationText)
                let sidebarContent: React.ReactNode = component.text || component.informationText || undefined
                            
                // if undefined, then treat as list of objects                                            
                sidebarContent = component.sidebarContent?.map((child, i) => (
                            <div key={i}>
                                {jsonRenderComponent(child, formData, onChange)}
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
            case "GradeTable":
                if(!component.id) {
                    alert('GradeTable component requires an id');
                    return null;
                }

                let gradeTable : [string, string][] = [];
                try{
                    const parsedTable = JSON.parse(formData[component.id] || "[]");
                    if(Array.isArray(parsedTable))  gradeTable = parsedTable; 
                } catch {
                    gradeTable = [];
                }

                return (
                    <GradeTable 
                    id={component.id}
                    data={gradeTable}
                    onChange={(updated) => 
                        onChange(component.id!, JSON.stringify(updated))
                    }
                    />
                );
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
                    policy_checkboxes="policy_checkboxes"
                    resources_checkboxes="resources_checkboxes"/>
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
export default jsonRenderComponent;
