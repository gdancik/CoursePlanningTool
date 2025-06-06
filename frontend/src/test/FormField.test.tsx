import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormField from "../screens/SyllabusView/BasicInformation/FormField";

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
    const mockOnChange = jest.fn();

    render(
        <FormField field={field} value="" onChange={mockOnChange} />
    );

    // Check that the label text is there
    expect(screen.getByText("Additional Information")).toBeInTheDocument();

    // Check that the helper text is there
    expect(screen.getByText(/Enter additional information here./i)).toBeInTheDocument();

    // Check that the textarea is present
    const textarea = screen.getByRole("textbox", { name: /Additional Information/i });
    expect(textarea).toBeInTheDocument();

    // Simulate typing
    fireEvent.change(textarea, { target: { value: "Some notes" } });
    expect(mockOnChange).toHaveBeenCalledWith("Additional Information", "Some notes");
});
