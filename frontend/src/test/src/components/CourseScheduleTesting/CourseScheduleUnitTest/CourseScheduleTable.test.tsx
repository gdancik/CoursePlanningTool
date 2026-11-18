import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";

import { CourseScheduleTable } from
    "../../../../../components/CourseScheduleComponent/CourseSchedule/CourseScheduleTable";

type TableProps = ComponentProps<typeof CourseScheduleTable>;
type ScheduleRow = TableProps["rows"][number];

const createRow = (
    id: string,
    overrides: Partial<ScheduleRow> = {}
): ScheduleRow =>
    ({
        id,
        date: "01/20/2026",
        day: "T",
        unit: "Introduction",
        learningOutcomes: "Outcome 1",
        readingAssignments: "Chapter 1",
        ...overrides,
    }) as ScheduleRow;

const createProps = (
    overrides: Partial<TableProps> = {}
): TableProps => ({
    id: "course-schedule-test",
    rows: [createRow("row-1")],
    addRow: jest.fn(),
    deleteRow: jest.fn(),
    updateDateField: jest.fn(),
    normalizeDateField: jest.fn(),
    updateRowField: jest.fn(),
    ...overrides,
});

describe("CourseScheduleTable", () => {
    it("renders the schedule headers and existing row values", () => {
        render(<CourseScheduleTable {...createProps()} />);

        expect(screen.getByRole("table")).toHaveAttribute(
            "id",
            "course-schedule-test"
        );

        expect(screen.getByText("Date")).toBeInTheDocument();
        expect(screen.getByText("Day")).toBeInTheDocument();

        expect(screen.getByDisplayValue("01/20/2026"))
            .toBeInTheDocument();

        expect(screen.getByDisplayValue("Introduction"))
            .toBeInTheDocument();

        expect(screen.getByDisplayValue("Outcome 1"))
            .toBeInTheDocument();

        expect(screen.getByDisplayValue("Chapter 1"))
            .toBeInTheDocument();
    });

    it.each([
        {
            field: "day",
            column: 1,
            value: "MWF",
        },
        {
            field: "unit",
            column: 2,
            value: "New Unit",
        },
        {
            field: "learningOutcomes",
            column: 3,
            value: "New Outcome",
        },
        {
            field: "readingAssignments",
            column: 4,
            value: "New Assignment",
        },
    ] as const)(
        "updates the $field field",
        ({ field, column, value }) => {
            const props = createProps();

            render(<CourseScheduleTable {...props} />);

            const textareas = screen.getAllByRole("textbox");

            fireEvent.change(textareas[column], {
                target: { value },
            });

            expect(props.updateRowField).toHaveBeenCalledWith(
                0,
                field,
                value
            );
        }
    );

    it("updates the date field while typing", () => {
        const props = createProps();

        render(<CourseScheduleTable {...props} />);

        const dateInput = screen.getAllByRole("textbox")[0];

        fireEvent.change(dateInput, {
            target: { value: "2/3/26" },
        });

        expect(props.updateDateField).toHaveBeenCalledWith(
            0,
            "2/3/26"
        );
    });

    it("normalizes the date field on blur", () => {
        const props = createProps();

        render(<CourseScheduleTable {...props} />);

        const dateInput = screen.getAllByRole("textbox")[0];

        fireEvent.blur(dateInput, {
            target: { value: "2/3/26" },
        });

        expect(props.normalizeDateField).toHaveBeenCalledWith(
            0,
            "2/3/26"
        );
    });

    it("adds a row at the selected index", () => {
        const props = createProps({
            rows: [
                createRow("row-1"),
                createRow("row-2"),
            ],
        });

        render(<CourseScheduleTable {...props} />);

        const addButtons = screen.getAllByRole("button", {
            name: "Add row",
        });

        fireEvent.click(addButtons[1]);

        expect(props.addRow).toHaveBeenCalledWith(1);
    });

    it("deletes a row at the selected index", () => {
        const props = createProps({
            rows: [
                createRow("row-1"),
                createRow("row-2"),
            ],
        });

        render(<CourseScheduleTable {...props} />);

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete row",
        });

        fireEvent.click(deleteButtons[0]);

        expect(props.deleteRow).toHaveBeenCalledWith(0);
    });

    it("does not allow deletion when only one row exists", () => {
        render(<CourseScheduleTable {...createProps()} />);

        expect(
            screen.queryByRole("button", {
                name: "Delete row",
            })
        ).not.toBeInTheDocument();
    });

    it("renders one set of controls for each row", () => {
        const props = createProps({
            rows: [
                createRow("row-1"),
                createRow("row-2"),
                createRow("row-3"),
            ],
        });

        render(<CourseScheduleTable {...props} />);

        const table = screen.getByRole("table");

        expect(
            within(table).getAllByRole("textbox")
        ).toHaveLength(15);

        expect(
            screen.getAllByRole("button", {
                name: "Add row",
            })
        ).toHaveLength(3);

        expect(
            screen.getAllByRole("button", {
                name: "Delete row",
            })
        ).toHaveLength(3);
    });

    it("applies the expected character limits", () => {
        render(<CourseScheduleTable {...createProps()} />);

        const textareas = screen.getAllByRole("textbox");

        expect(textareas[0]).toHaveAttribute("maxLength", "30");
        expect(textareas[1]).toHaveAttribute("maxLength", "30");

        expect(textareas[2]).toHaveAttribute("maxLength", "200");
        expect(textareas[3]).toHaveAttribute("maxLength", "200");
        expect(textareas[4]).toHaveAttribute("maxLength", "200");
    });
});