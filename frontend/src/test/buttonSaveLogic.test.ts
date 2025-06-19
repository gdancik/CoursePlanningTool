// Import the function to be tested
import { saveJsonFile } from "../components/Button/ButtonLogic";

test("creates a JSON file for download", () => {
    // Test data to be saved
    const data = { name: "Test" };

    // Create Jest mocks for URL.createObjectURL and URL.revokeObjectURL
    const mockCreateObjectURL = jest.fn();
    const mockRevokeObjectURL = jest.fn();

    // Assign the mocks to the global URL object to intercept calls
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Call the function under test
    saveJsonFile(data, "test.json");

    // Assertions to ensure both methods were called
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
});
