import { generateRowIdentifiers } from "../utils/generateRowIdentifiers";

test("generates kebab-case row identifier", () => {
    expect(generateRowIdentifiers("My Label")).toBe("my-label");
    expect(generateRowIdentifiers("Label! With 123")).toBe("label-with-123");
});
