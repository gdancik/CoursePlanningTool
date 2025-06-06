import { jsonFieldsMapper } from "../utils/jsonFieldsMapper";

// Mock fieldMappings directly
jest.mock("../utils/fieldMappings", () => ({
    fieldMappings: {
        "Subject Course": "course_subject",
        "Instructor Name": "instructor_name"
    }
}));

test("maps frontend keys to backend keys using fieldMappings", () => {
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