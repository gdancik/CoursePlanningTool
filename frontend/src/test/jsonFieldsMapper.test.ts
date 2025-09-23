// src/test/jsonFieldsMapper.test.ts

// Mock both validInputs and allowedBackendKeys
jest.mock("../utils/validInputs", () => ({
    fieldMappings: {
        "Subject Course": "course_subject",
        "Instructor Name": "instructor_name"
    }
}));

jest.mock("../utils/allowableCalls", () => ({
    allowedBackendKeys: new Set([
        "course_subject",
        "instructor_name",
        "Unmapped Field"  // include any original labels you want preserved
    ])
}));

import { jsonFieldsMapper } from "../utils/jsonFieldsMapper";

test("maps frontend keys to backend keys using validInputs", () => {
    const input = {
        "Subject Course": "Math 101",
        "Instructor Name": "Dr. Smith",
        "Unmapped Field": "Keep original"
    };

    const expected = {
        "course_subject": "Math 101",
        "instructor_name": "Dr. Smith",
        "Unmapped Field": "Keep original"
    };

    const result = jsonFieldsMapper(input);
    expect(result).toEqual(expected);
});
