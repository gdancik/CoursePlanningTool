// Import React and testing utilities
import React from "react";
import { render, screen } from "@testing-library/react";
import FormRow from "../screens/SyllabusView/BasicInformation/FormRow";
import { BasicInfoData } from "../utils/loadBasicInfoFields";

test("renders FormRow with FormField", () => {
    // Field configuration for testing (a basic text input)
    const field: BasicInfoData = {
        label: "Name",
        type: "text",
        required: false,
        row: 1,
        layoutRow: 1,
        section: "Basic Info",
        placeholder: "Enter name"
    };

    // Render the FormRow component
    render(
        <FormRow
            field={field}
            value=""          // Initial empty value
            onChange={() => {}} // Dummy onChange handler
        />
    );

    // Assert that the input element is present and has the correct label
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
});
