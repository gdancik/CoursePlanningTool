import React from "react";
import { render, screen } from "@testing-library/react";
import FormRow from "../screens/SyllabusView/BasicInformation/FormRow";
import { BasicInfoData } from "../utils/loadBasicInfoFields";

test("renders FormRow with FormField", () => {
    const field: BasicInfoData = {
        label: "Name",
        type: "text",
        required: false,
        row: 1,
        layoutRow: 1,
        section: "Basic Info",
        placeholder: "Enter name"
    };

    render(
        <FormRow
            field={field}
            value=""
            onChange={() => {}}
        />
    );

    // Assert that the input renders with the correct label
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
});
