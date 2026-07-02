/**
 * Service for fetching and managing valid inputs from the API
 * Used to validate section completeness in the Syllabus Page Builder
 */

import api from "./apiClient";
import { FormState } from "../utils/PageRenderEngine/types";

export interface ValidInputsResponse {
    [sectionId: string]: string[] | null;
}

/**
 * Fetches the valid inputs configuration from the API.
 * Returns an object with section IDs as keys and arrays of field IDs as values.
 * Returns empty object if API call fails.
 */
export async function fetchRequiredInputs(): Promise<ValidInputsResponse> {
    try {
        return await api
            .get("valid_inputs/", {
                searchParams: {
                    type: "required",
                },
            })
            .json<ValidInputsResponse>();
    } catch (error) {
        console.warn(
            "Could not fetch valid inputs from API, using empty validation:",
            error
        );

        return {};
    }
}

/**
 * Checks if a section is complete by verifying all required fields have values.
 * @param sectionId - The section identifier, e.g. "basic_information"
 * @param validInputs - The valid inputs configuration from the API
 * @param formData - The current form data for the selected course
 * @returns true if all required fields have non-empty values
 */
export function isSectionComplete(
    sectionId: string,
    validInputs: ValidInputsResponse,
    formData: FormState
): boolean {
    const requiredFields = validInputs[sectionId];

    if (!requiredFields || requiredFields.length === 0) {
        return false;
    }

    if (!formData) {
        return false;
    }

    return requiredFields.every((fieldId) => {
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
}