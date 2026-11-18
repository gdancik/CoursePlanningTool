import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react"

import { CourseScheduleToolbar } from
    "../../../../../components/CourseScheduleComponent/CourseSchedule/CourseScheduleToolbar";

// Mock shared UI components so these tests focus on toolbar behavior.
jest.mock("../../../../../components/Button/ReusableButton", () => ({
    __esModule: true,
    default: ({
        label,
        onClick,
        disabled,
    }: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
    }) => (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
        >
            {label}
        </button>
    ),
}));

jest.mock("../../../../../components/SyllabusComponents/Checkbox", () => ({
    __esModule: true,
    default: ({
        id,
        label,
        checked,
        onChange,
    }: {
        id: string;
        label: string;
        checked: boolean;
        onChange: () => void;
    }) => (
        <label htmlFor={id}>
            {label}
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
        </label>
    ),
}));

type ToolbarProps = ComponentProps<typeof CourseScheduleToolbar>;

const createProps = (
    overrides: Partial<ToolbarProps> = {}
): ToolbarProps => ({
    missingScheduleInformation: false,
    normalizedTerm: "Spring",
    normalizedYear: "2026",
    normalizedDays: "MWF",
    isGeneratingSchedule: false,
    dateFormat: "mm/dd/yyyy",
    datesSorted: false,

    generateSchedule: jest.fn(),
    clearSchedule: jest.fn(),
    sortScheduleByDate: jest.fn(),
    changeDateFormat: jest.fn(),

    dayDisplayOption: {
        format: "codes",
        thursdayOption: "R",
    },

    useOneLetterDays: true,
    changeUseOneLetterDays: jest.fn(),
    changeThursdayDisplayOption: jest.fn(),

    downloadExcelTemplate: jest.fn(),
    exportScheduleToExcel: jest.fn(),
    importScheduleFromExcel: jest.fn(),

    ...overrides,
} as ToolbarProps);

describe("CourseScheduleToolbar", () => {
    it("renders the generate button with schedule information", () => {
        render(<CourseScheduleToolbar {...createProps()} />);

        expect(
            screen.getByRole("button", {
                name: "Generate Schedule (Spring 2026, MWF)",
            })
        ).toBeEnabled();
    });

    it("calls generateSchedule when clicked", () => {
        const props = createProps();

        render(<CourseScheduleToolbar {...props} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /Generate Schedule/,
            })
        );

        expect(props.generateSchedule).toHaveBeenCalledTimes(1);
    });

    it("disables generation when schedule information is missing", () => {
        const props = createProps({
            missingScheduleInformation: true,
        });

        render(<CourseScheduleToolbar {...props} />);

        expect(
            screen.getByRole("button", {
                name: /Generate Schedule/,
            })
        ).toBeDisabled();

        expect(
            screen.getByText(/enter a term, year, and days/i)
        ).toBeInTheDocument();
    });

    it("shows a generating state and disables the button", () => {
        const props = createProps({
            isGeneratingSchedule: true,
        });

        render(<CourseScheduleToolbar {...props} />);

        expect(
            screen.getByRole("button", {
                name: "Generating...",
            })
        ).toBeDisabled();
    });

    it.each([
        {
            name: "Clear Schedule",
            callback: "clearSchedule",
        },
        {
            name: "Download Template",
            callback: "downloadExcelTemplate",
        },
        {
            name: "Export Excel",
            callback: "exportScheduleToExcel",
        },
        {
            name: "Sort by date",
            callback: "sortScheduleByDate",
        },
    ] as const)(
        "calls $callback when $name is clicked",
        ({ name, callback }) => {
            const props = createProps();

            render(<CourseScheduleToolbar {...props} />);

            fireEvent.click(
                screen.getByRole("button", { name })
            );

            expect(props[callback]).toHaveBeenCalledTimes(1);
        }
    );

    it("disables sorting when dates are already sorted", () => {
        const props = createProps({
            datesSorted: true,
        });

        render(<CourseScheduleToolbar {...props} />);

        expect(
            screen.getByRole("button", {
                name: "Sort by date",
            })
        ).toBeDisabled();
    });

    it.each([
        "mm/dd",
        "mm/dd/yyyy",
        "mm/dd/yy",
    ] as const)(
        "changes the date format to %s",
        (format) => {
            const props = createProps();

            render(<CourseScheduleToolbar {...props} />);

            fireEvent.change(
                screen.getByLabelText("Date format:"),
                {
                    target: { value: format },
                }
            );

            expect(props.changeDateFormat)
                .toHaveBeenCalledWith(format);
        }
    );

    it("calls changeUseOneLetterDays when toggled", () => {
        const props = createProps();

        render(<CourseScheduleToolbar {...props} />);

        fireEvent.click(
            screen.getByRole("checkbox", {
                name: "Use one-letter days",
            })
        );

        expect(props.changeUseOneLetterDays)
            .toHaveBeenCalledTimes(1);
    });

    it("shows Thursday options when one-letter days are enabled", () => {
        render(
            <CourseScheduleToolbar
                {...createProps({
                    useOneLetterDays: true,
                })}
            />
        );

        expect(
            screen.getByLabelText("Thursday:")
        ).toBeInTheDocument();
    });

    it("hides Thursday options when one-letter days are disabled", () => {
        render(
            <CourseScheduleToolbar
                {...createProps({
                    useOneLetterDays: false,
                })}
            />
        );

        expect(
            screen.queryByLabelText("Thursday:")
        ).not.toBeInTheDocument();
    });

    it.each(["R", "Th"] as const)(
        "changes the Thursday display option to %s",
        (option) => {
            const props = createProps();

            render(<CourseScheduleToolbar {...props} />);

            fireEvent.change(
                screen.getByLabelText("Thursday:"),
                {
                    target: { value: option },
                }
            );

            expect(props.changeThursdayDisplayOption)
                .toHaveBeenCalledWith(option);
        }
    );

    it("opens the file picker when Import Excel is clicked", () => {
        const props = createProps();

        const { container } = render(
            <CourseScheduleToolbar {...props} />
        );

        const fileInput = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        const clickSpy = jest.spyOn(fileInput, "click");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Import Excel",
            })
        );

        expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("imports the selected Excel file", () => {
        const props = createProps();

        const { container } = render(
            <CourseScheduleToolbar {...props} />
        );

        const fileInput = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        const file = new File(
            ["excel-content"],
            "schedule.xlsx",
            {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }
        );

        fireEvent.change(fileInput, {
            target: {
                files: [file],
            },
        });

        expect(props.importScheduleFromExcel)
            .toHaveBeenCalledWith(file);

        expect(fileInput.value).toBe("");
    });

    it("does not import when no file is selected", () => {
        const props = createProps();

        const { container } = render(
            <CourseScheduleToolbar {...props} />
        );

        const fileInput = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        fireEvent.change(fileInput, {
            target: {
                files: [],
            },
        });

        expect(props.importScheduleFromExcel)
            .not.toHaveBeenCalled();
    });
});