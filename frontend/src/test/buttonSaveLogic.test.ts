import { saveJsonFile } from "../utils/ButtonLogic";

test("creates a JSON file for download", () => {
    const data = { name: "Test" };
    const mockCreateObjectURL = jest.fn();
    const mockRevokeObjectURL = jest.fn();

    // Mock URL methods
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    saveJsonFile(data, "test.json");

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
});
