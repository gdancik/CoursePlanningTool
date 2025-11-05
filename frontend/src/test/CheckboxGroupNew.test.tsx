import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CheckboxGroup from "../components/SyllabusComponents/CheckboxGroup";

/**
 * Controlled test wrapper — mimics how CheckboxGroup is used in real components.
 * Keeps internal state so `onChange` re-renders the group.
 */
type PartialCheckboxGroupProps = Partial<React.ComponentProps<typeof CheckboxGroup>>;

const ControlledCheckboxGroup: React.FC<PartialCheckboxGroupProps> = (props) => {
  const [value, setValue] = useState<string[]>([]);
  return <CheckboxGroup {...(props as any)} value={value} onChange={setValue} />;
};

describe("CheckboxGroup Component", () => {
  test("renders without crashing with default props", () => {
    render(<ControlledCheckboxGroup />);
  });

  test("displays default data when no data prop provided", () => {
    render(<ControlledCheckboxGroup />);
    const group = screen.getByRole("group");
    expect(group).toBeInTheDocument();
  });

  test("displays custom data when provided", () => {
    const customData = ["Quiz", "Exam", "Project"];
    render(<ControlledCheckboxGroup data={customData} />);

    expect(screen.getByLabelText("Quiz")).toBeInTheDocument();
    expect(screen.getByLabelText("Exam")).toBeInTheDocument();
    expect(screen.getByLabelText("Project")).toBeInTheDocument();
  });

  test("renders Check All option when included in data", () => {
    const dataWithCheckAll = ["Check All", "Option 1", "Option 2"];
    render(<ControlledCheckboxGroup data={dataWithCheckAll} />);

    expect(screen.getByLabelText("Check All")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  test("individual checkbox can be checked and unchecked", () => {
    render(<ControlledCheckboxGroup data={["Option 1", "Option 2"]} />);

    const option1 = screen.getByLabelText("Option 1");
    expect(option1).not.toBeChecked();

    fireEvent.click(option1);
    expect(option1).toBeChecked();

    fireEvent.click(option1);
    expect(option1).not.toBeChecked();
  });

  test("Check All functionality works correctly", () => {
    const dataWithCheckAll = ["Check All", "Option 1", "Option 2", "Option 3"];
    render(<ControlledCheckboxGroup data={dataWithCheckAll} />);

    const checkAll = screen.getByLabelText("Check All");
    const option1 = screen.getByLabelText("Option 1");
    const option2 = screen.getByLabelText("Option 2");
    const option3 = screen.getByLabelText("Option 3");

    // Initially all unchecked
    expect(checkAll).not.toBeChecked();
    expect(option1).not.toBeChecked();

    // Click Check All
    fireEvent.click(checkAll);
    expect(checkAll).toBeChecked();
    expect(option1).toBeChecked();
    expect(option2).toBeChecked();
    expect(option3).toBeChecked();

    // Click again to uncheck all
    fireEvent.click(checkAll);
    expect(checkAll).not.toBeChecked();
    expect(option1).not.toBeChecked();
    expect(option2).not.toBeChecked();
    expect(option3).not.toBeChecked();
  });

  test("Check All updates when individual items are checked/unchecked", () => {
    const dataWithCheckAll = ["Check All", "Option 1", "Option 2"];
    render(<ControlledCheckboxGroup data={dataWithCheckAll} />);

    const checkAll = screen.getByLabelText("Check All");
    const option1 = screen.getByLabelText("Option 1");
    const option2 = screen.getByLabelText("Option 2");

    // Check all individual items
    fireEvent.click(option1);
    fireEvent.click(option2);
    expect(checkAll).toBeChecked();

    // Uncheck one
    fireEvent.click(option1);
    expect(checkAll).not.toBeChecked();
  });

  test("applies custom id when provided", () => {
    const customId = "meeting-days-checkboxes";
    render(<ControlledCheckboxGroup id={customId} />);
    const container = document.getElementById(customId);
    expect(container).toBeInTheDocument();
  });

  test("renders in horizontal layout by default", () => {
    const { container } = render(<ControlledCheckboxGroup />);
    const checkboxGroup = container.querySelector("#checkbox_group");
    expect(checkboxGroup).toHaveStyle("flex-direction: row");
  });

  test("renders in vertical layout when horizontal=false", () => {
    const { container } = render(<ControlledCheckboxGroup horizontal={false} />);
    const checkboxGroup = container.querySelector("#checkbox_group");
    expect(checkboxGroup).toHaveStyle("flex-direction: column");
  });

  test("handles empty data array", () => {
    render(<ControlledCheckboxGroup data={[]} />);
    const container = document.querySelector("#checkbox_group");
    expect(container).toBeInTheDocument();
    expect(container?.children).toHaveLength(0);
  });
});
