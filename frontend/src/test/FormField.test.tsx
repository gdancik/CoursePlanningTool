// Import React and testing utilities
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormField from "../screens/SyllabusView/BasicInformation/FormField";

// Test field configuration for a textarea
const field = {
    label: "Additional Information",
    placeholder: "Enter additional information here.",
    type: "textarea",
    required: false,
    row: 1,
    layoutRow: 1,
    section: "Basic Info"
};

test("renders textarea with helper text above it", () => {
    // Create a mock onChange function to verify the callback
    const mockOnChange = jest.fn();

    // Render the FormField component
    render(
        <FormField field={field} value="" onChange={mockOnChange} />
    );

    // Check that the label is displayed
    expect(screen.getByText("Additional Information")).toBeInTheDocument();

    // Check that the helper (placeholder) text is displayed
    expect(screen.getByText(/Enter additional information here./i)).toBeInTheDocument();

    // Check that the textarea element is rendered
    const textarea = screen.getByRole("textbox", { name: /Additional Information/i });
    expect(textarea).toBeInTheDocument();

    // Simulate typing in the textarea
    fireEvent.change(textarea, { target: { value: "Some notes" } });

    // Verify that onChange was called with the correct arguments
    expect(mockOnChange).toHaveBeenCalledWith("Additional Information", "Some notes");
});
