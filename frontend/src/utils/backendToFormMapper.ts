// src/utils/backendToFormMapper.ts
import { reverseFieldMappings } from "./fieldMappings";

export function mapBackendDataToFormFields(
    backendData: Record<string, string>
): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(backendData)) {
        const frontendKey = reverseFieldMappings[key];
        if (frontendKey) {
            result[frontendKey] = value;
        }
    }

    // Special case for "term_syllabus"
    if (backendData.term_syllabus) {
        const [year, semester] = backendData.term_syllabus.split("-");
        result["Year"] = year;
        result["Semester"] = semester;
    }

    return result;
}
