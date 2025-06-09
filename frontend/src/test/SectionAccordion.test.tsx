// Import React and testing utilities
import React from "react";
import { render, screen } from "@testing-library/react";
import SectionAccordion from "../screens/SyllabusView/BasicInformation/SectionAccordion";
import { BasicInfoData } from "../utils/loadBasicInfoFields";

// Mock field data representing grouped rows and fields
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
        layoutRow: 1,
        section: "Basic Info",
        placeholder: "Enter additional information"
    }
];

test("renders SectionAccordion with grouped rows and fields", () => {
    // Render the SectionAccordion component with mock data and form data
    render(
        <SectionAccordion
            sectionName="Basic Info"
            fields={mockFields}
            formData={{
                Name: "Alice",
                Description: "Some desc",
                "Additional Information": ""
            }}
            onFieldChange={() => {}} // Dummy handler
        />
    );

    // Assert that the section name/title is rendered
    expect(screen.getByText("Basic Info")).toBeInTheDocument();

    // Assert that inputs/textareas for each field are present
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument(); // Text input
    expect(screen.getByRole("textbox", { name: /Description/i })).toBeInTheDocument(); // Description textarea
    expect(screen.getByRole("textbox", { name: /Additional Information/i })).toBeInTheDocument(); // Additional Information textarea
});
