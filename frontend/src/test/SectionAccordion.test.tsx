import React from "react";
import { render, screen } from "@testing-library/react";
import SectionAccordion from "../components/SyllabusComponents/SectionAccordion";
import { JsonComponent } from "../utils/jsonRenderer";

const mockContent: JsonComponent[] = [
  {
    type: "text",
    id: "Name",
    label: "Name",
    placeholder: "Enter name",
    required: false,
    className: "",
  },
  {
    type: "textarea",
    id: "Description",
    label: "Description",
    placeholder: "Enter description",
    required: false,
    className: "",
  },
  {
    type: "textarea",
    id: "Additional Information",
    label: "Additional Information",
    placeholder: "Enter additional information",
    required: false,
    className: "",
  },
];

test("renders SectionAccordion with grouped rows and fields", () => {
  render(
    <SectionAccordion
      sectionName="Basic Info"
      content={mockContent}   
      formData={{
        Name: "Alice",
        Description: "Some desc",
        "Additional Information": ""
      }}
      onFieldChange={() => {}}
    />
  );

  expect(screen.getByText("Basic Info")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /Description/i })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /Additional Information/i })).toBeInTheDocument();
});
