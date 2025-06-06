import { loadBasicInfoFields } from "../utils/loadBasicInfoFields";


jest.mock("../utils/loadBasicInfoFields", () => ({
    loadBasicInfoFields: jest.fn(() =>
        Promise.resolve([
            { label: "Subject Code", type: "text", required: true, section: "Course Information", row: "1" }
        ])
    )
}));

test("returns parsed field data", async () => {
    const { loadBasicInfoFields } = require("../utils/loadBasicInfoFields");
    const result = await loadBasicInfoFields("/data/sample_fields.csv");

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toMatchObject({
        label: "Subject Code",
        type: "text",
        section: "Course Information"
    });
});
