import React from "react";
import { render, screen } from "@testing-library/react";
import SectionAccordion from "../screens/SyllabusView/BasicInformation/SectionAccordion";
import { BasicInfoData } from "../utils/loadBasicInfoFields";

const mockFields: BasicInfoData[] = [
    {
        label: "Name",
        type: "text",
        required: false,
        row: 1,
        layoutRow: 1,
        section: "Basic Info",
        placeholder: "Enter name"
    },
    {
        label: "Description",
        type: "textarea",
        required: false,
        row: 1,
        layoutRow: 1,
        section: "Basic Info",
        placeholder: "Enter description"
    },
    {
        label: "Additional Information",
        type: "textarea",
        required: false,
        row: 2,
        layoutRow:1,
        section: "Basic Info",
        placeholder: "Enter additional information"
    }
];

test("renders SectionAccordion with grouped rows and fields", () => {
    render(
        <SectionAccordion
            sectionName="Basic Info"
            fields={mockFields}
            formData={{
                Name: "Alice",
                Description: "Some desc",
                "Additional Information": ""
            }}
            onFieldChange={() => {}}
        />
    );

    expect(screen.getByText("Basic Info")).toBeInTheDocument();

    // Check presence of inputs using robust queries
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Description/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Additional Information/i })).toBeInTheDocument();
});
