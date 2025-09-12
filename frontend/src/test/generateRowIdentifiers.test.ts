// Import the function to be tested
import { generateRowIdentifiers } from "../utils/generateRowIdentifiers";

test("generates kebab-case row identifier", () => {
    // Test case: spaces are replaced with hyphens and lowercase applied
    expect(generateRowIdentifiers("My Label")).toBe("my-label");

    // Test case: special characters are removed, digits are retained, lowercase applied
    expect(generateRowIdentifiers("Label! With 123")).toBe("label-with-123");
});
