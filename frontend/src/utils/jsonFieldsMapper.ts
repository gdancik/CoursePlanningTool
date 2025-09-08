// This file takes the dictionary data structure from validInputs and assigns them accordingly.

import { validInputs } from "./validInputs"; // Import the mapping dictionary
import {allowedBackendKeys} from './allowableCalls'

/**
 * Maps frontend field labels to backend field keys based on the validInputs.
 * If a label isn't in validInputs, it falls back to the original label.
 *
 * @param input - An object with frontend field labels and their values.
 * @returns A new object with mapped backend field keys and their values.
 */
export function jsonFieldsMapper(input: Record<string, string>): Record<string, string> {
    const output: Record<string, string> = {}; // Initialize output object

    // Iterate over each field in the input object
    for (const [frontendLabel, value] of Object.entries(input)) {
        if(value === "Choose One") continue;
        // Get the corresponding backend key from validInputs, or use the original label
        const backendKey = validInputs[frontendLabel] || frontendLabel;
        if (allowedBackendKeys.has(backendKey)) {
            output[backendKey] = value;
        }
    }

    return output; // Return the new object with mapped keys
}
