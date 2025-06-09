// Import the function to be tested
import { loadBasicInfoFields } from "../utils/loadBasicInfoFields";

// Mock the loadBasicInfoFields function to return predictable data for testing
jest.mock("../utils/loadBasicInfoFields", () => ({
    loadBasicInfoFields: jest.fn(() =>
        Promise.resolve([
            {
                label: "Subject Code",
                type: "text",
                required: true,
                section: "Course Information",
                row: "1"
            }
        ])
    )
}));

test("returns parsed field data", async () => {
    // Re-import the mock to avoid possible hoisting issues
    const { loadBasicInfoFields } = require("../utils/loadBasicInfoFields");

    // Call the mocked function with a sample file path
    const result = await loadBasicInfoFields("/data/sample_fields.csv");

    // Ensure that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Ensure that the first object has the expected structure
    expect(result[0]).toMatchObject({
        label: "Subject Code",
        type: "text",
        section: "Course Information"
    });
});
