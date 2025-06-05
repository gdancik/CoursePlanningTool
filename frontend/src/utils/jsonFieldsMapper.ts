//This file Takes the dictionary Data Structure from teh field Mappings and assignts them accordingly

import {fieldMappings} from "./fieldMappings";

export function jsonFieldsMapper(input: Record <string, string>): Record<string, string> {
    const output: Record<string, string> = {};
    for (const[frontendLabel, value] of Object.entries(input)){
        const backendKey = fieldMappings[frontendLabel] || frontendLabel; //assigns new label else falls back to original
        output [backendKey] = value;
    }
    return output;
 }