/**
 * Service for fetching and managing valid inputs from the API
 * Used to validate section completeness in the Syllabus Page Builder
 */

import api from './axios';
import {FormState} from "../utils/types";

export interface ValidInputsResponse {
    [sectionId: string]: string[] | null;
}

/**
 * Fetches the valid inputs configuration from the API
 * Returns an object with section IDs as keys and arrays of field IDs as values
 * Returns empty object if API call fails (e.g., network error, SSL certificate issue)
 */
export async function fetchRequiredInputs(): Promise<ValidInputsResponse> {
    try {
        const response = await api.get('/valid_inputs/?type=required');      
        return response.data;
    } catch (error) {
        console.warn('Could not fetch valid inputs from API, using empty validation:', error);
        // Return empty object to prevent page from breaking
        return {};
    }
}

/**
 * Checks if a section is complete by verifying all required fields have values
 * @param sectionId - The section identifier (e.g., 'basic_information')
 * @param validInputs - The valid inputs configuration from the API
 * @param formData - The current form data from localStorage
 * @returns true if all required fields have non-empty values
 */
export function isSectionComplete(
    sectionId: string,
    validInputs: ValidInputsResponse,
    formData: FormState,
): boolean {
    // Get the required field IDs for this section
 
    //console.log(formData);
   
    const requiredFields = validInputs[sectionId];
    
    if (!requiredFields || requiredFields.length === 0) {
        return false;
    }

    if (!formData || formData == null) {
        return false;
    }
    
    //console.log('checking ' + sectionId + ' --------------');
 
    // Check if all required fields have values
    const complete = requiredFields.every((fieldId) => {
        const value = formData[fieldId];

        if (value === undefined || value === null) {
            return false;
        }

        if (typeof value === "string" && value.trim() === "") {
            return false;
        }

        if (fieldId.endsWith("list")) {
            if (typeof value !== "string") {
                return false;
            }

            try {
                const arr = JSON.parse(value).slice(1).flat().join("").trim();
                return arr !== "";
            } catch {
                return false;
            }
        }

        return true;
    });

    //console.log(sectionId + " complete: " + complete);
    //console.log(formData[sectionId]);
    
    return complete;
}

/**
 * Gets the current course data from localStorage
 */
export function getCurrentCourseData(): Record<string, string> {
    try {
        const saved = localStorage.getItem("currentCourseData");
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.savedData || {};
        }
    } catch (error) {
        console.error('Error parsing saved course data:', error);
    }
    return {};
}
