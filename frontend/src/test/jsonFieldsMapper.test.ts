// Import the jsonFieldsMapper function to be tested
import { jsonFieldsMapper } from "../utils/jsonFieldsMapper";

// Mock the fieldMappings to ensure a controlled environment for testing
jest.mock("../utils/fieldMappings", () => ({
    fieldMappings: {
        "Subject Course": "course_subject",
        "Instructor Name": "instructor_name"
    }
}));

test("maps frontend keys to backend keys using fieldMappings", () => {
    // Input data containing mapped and unmapped fields
    const input = {
        "Subject Course": "Math 101",      // Should be mapped to "course_subject"
        "Instructor Name": "Dr. Smith",    // Should be mapped to "instructor_name"
        "Unmapped Field": "Keep original"  // Should stay as is
    };

    // Expected output after mapping
    const expected = {
        "course_subject": "Math 101",
        "instructor_name": "Dr. Smith",
        "Unmapped Field": "Keep original"
    };

    // Run the mapping function
    const result = jsonFieldsMapper(input);

    // Check that the result matches the expected output
    expect(result).toEqual(expected);
});
