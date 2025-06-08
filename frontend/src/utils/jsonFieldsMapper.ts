// This file takes the dictionary data structure from fieldMappings and assigns them accordingly.

import { fieldMappings } from "./fieldMappings"; // Import the mapping dictionary

/**
 * Maps frontend field labels to backend field keys based on the fieldMappings.
 * If a label isn't in fieldMappings, it falls back to the original label.
 *
 * @param input - An object with frontend field labels and their values.
 * @returns A new object with mapped backend field keys and their values.
 */
export function jsonFieldsMapper(input: Record<string, string>): Record<string, string> {
    const output: Record<string, string> = {}; // Initialize output object

    // Iterate over each field in the input object
    for (const [frontendLabel, value] of Object.entries(input)) {
        // Get the corresponding backend key from fieldMappings, or use the original label
        const backendKey = fieldMappings[frontendLabel] || frontendLabel;
        output[backendKey] = value; // Assign the value to the new (or same) key
    }

    return output; // Return the new object with mapped keys
}
