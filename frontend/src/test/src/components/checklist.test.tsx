import React from "react";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import Checklist from "../../../components/SyllabusComponents/ChecklistComponent";

import {
    fetchRequiredInputs,
    isSectionComplete, } from "../../../services/validInputsService"
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        pathname: "/checklist",
    }),
}));

jest.mock("../../../services/validInputsService", () => ({
    fetchRequiredInputs: jest.fn(),
    isSectionComplete: jest.fn(),
}));

jest.mock(
    "../../../components/SyllabusComponents/Information",
    () => {
        return function MockInformation({ text }: { text: string }) {
            return <div>{text}</div>;
        };
    }
);

jest.mock(
    "../../../components/SyllabusComponents/ContentCardSet",
    () => ({
        ContentCardSet: (props: any) => (
            <div data-testid="content-card-set">
                <span data-testid="card-set-id">{props.id}</span>
                <span data-testid="card-set-title">
                    {props.setTitle}
                </span>
                <span data-testid="initial-card-count">
                    {props.initialCards.length}
                </span>
                <span data-testid="min-cards">
                    {props.minCards}
                </span>
                <span data-testid="max-cards">
                    {props.maxCards}
                </span>
            </div>
        ),
    })
);

jest.mock(
    "../../../utils/course/ComponentWrapper",
    () => {
        return function MockSafeIcon() {
            return <span data-testid="safe-icon" />;
        };
    }
);

describe("Checklist", () => {
    const defaultProps = {
        formData: {},
        additional_sections_id: "additional_sections",
        policy_checkboxes_id: "policy_checkboxes",
        resources_checkboxes_id: "resources_checkboxes",
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (fetchRequiredInputs as jest.Mock).mockResolvedValue({});

        (isSectionComplete as jest.Mock).mockReturnValue(false);
    });

    test("fetches required inputs when the component mounts", async () => {
        render(<Checklist {...defaultProps} />);

        expect(fetchRequiredInputs).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(fetchRequiredInputs).toHaveBeenCalledTimes(1);
        });
    });

    test("renders all seven syllabus checklist sections", () => {
        render(<Checklist {...defaultProps} />);

        expect(
            screen.getByText("Basic Information")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Course Description")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Learning Outcomes")
        ).toBeInTheDocument();

        expect(
            screen.getByText("High Impact Practices (HIPs)")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Learning Resources")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Assessment")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Course Schedule")
        ).toBeInTheDocument();
    });

    test("checks whether every syllabus section is complete", () => {
        render(<Checklist {...defaultProps} />);

        expect(isSectionComplete).toHaveBeenCalledWith(
            "basic_information",
            expect.anything(),
            defaultProps.formData
        );

        expect(isSectionComplete).toHaveBeenCalledWith(
            "course_description",
            expect.anything(),
            defaultProps.formData
        );

        expect(isSectionComplete).toHaveBeenCalledWith(
            "learning_outcomes",
            expect.anything(),
            defaultProps.formData
        );

        expect(isSectionComplete).toHaveBeenCalledWith(
            "high_impact_practices",
            expect.anything(),
            defaultProps.formData
        );

        expect(isSectionComplete).toHaveBeenCalledWith(
            "learning_resources",
            expect.anything(),
            defaultProps.formData
        );

        expect(isSectionComplete).toHaveBeenCalledWith(
            "assessment",
            expect.anything(),
            defaultProps.formData
        );

        expect(isSectionComplete).toHaveBeenCalledWith(
            "course_schedule",
            expect.anything(),
            defaultProps.formData
        );
    });

    test("marks a checklist checkbox as checked when the section is complete", () => {
        (isSectionComplete as jest.Mock).mockImplementation(
            (sectionId: string) =>
                sectionId === "basic_information"
        );

        render(<Checklist {...defaultProps} />);

        expect(
            screen.getByLabelText("Basic Information completed")
        ).toBeChecked();

        expect(
            screen.getByLabelText("Course Description completed")
        ).not.toBeChecked();
    });

    test("navigates to the correct page when an edit button is clicked", () => {
        render(<Checklist {...defaultProps} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Edit Learning Outcomes",
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            "/learning-outcomes"
        );
    });

    test("passes additional section data from formData to ContentCardSet", async () => {
        const formData = {
            additional_sections: [
                {
                    title: "Attendance",
                    description: "Attendance information",
                },
                {
                    title: "Extra Credit",
                    description: "Extra credit information",
                },
            ],
        };

        render(
            <Checklist
                {...defaultProps}
                formData={formData}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByTestId("initial-card-count")
            ).toHaveTextContent("2");
        });

        expect(
            screen.getByTestId("card-set-id")
        ).toHaveTextContent("additional_sections");

        expect(
            screen.getByTestId("card-set-title")
        ).toHaveTextContent("Additional Sections");

        expect(
            screen.getByTestId("min-cards")
        ).toHaveTextContent("1");

        expect(
            screen.getByTestId("max-cards")
        ).toHaveTextContent("3");
    });

    test("initializes selected policies from formData", async () => {
        const formData = {
            policy_checkboxes: [
                "Academic Integrity",
                "Diversity Statement",
            ],
        };

        render(
            <Checklist
                {...defaultProps}
                formData={formData}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("Academic Integrity")
            ).toBeChecked();

            expect(
                screen.getByDisplayValue("Diversity Statement")
            ).toBeChecked();
        });

        expect(
            screen.getByDisplayValue(
                "Class Absence Verification"
            )
        ).not.toBeChecked();
    });

    test("initializes selected resources from formData", async () => {
        const formData = {
            resources_checkboxes: [
                "Writing Center",
                "Counseling and Psychological Services",
            ],
        };

        render(
            <Checklist
                {...defaultProps}
                formData={formData}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("Writing Center")
            ).toBeChecked();

            expect(
                screen.getByDisplayValue(
                    "Counseling and Psychological Services"
                )
            ).toBeChecked();
        });
    });

    test("toggles an individual policy", () => {
        render(<Checklist {...defaultProps} />);

        const checkbox =
            screen.getByDisplayValue("Academic Integrity");

        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);

        expect(checkbox).toBeChecked();

        fireEvent.click(checkbox);

        expect(checkbox).not.toBeChecked();
    });

    test("Check All selects every policy statement", () => {
        render(<Checklist {...defaultProps} />);

        fireEvent.click(
            screen.getByLabelText(
                "Check all policy statements"
            )
        );

        expect(
            screen.getByDisplayValue("Academic Integrity")
        ).toBeChecked();

        expect(
            screen.getByDisplayValue(
                "Class Absence Verification"
            )
        ).toBeChecked();

        expect(
            screen.getByDisplayValue("Diversity Statement")
        ).toBeChecked();

        expect(
            screen.getByDisplayValue(
                "Final Examination Statement"
            )
        ).toBeChecked();

        expect(
            screen.getByDisplayValue(
                "Sexual Misconduct Policy"
            )
        ).toBeChecked();

        expect(
            screen.getByDisplayValue(
                "Class Meetings During Inclement Weather"
            )
        ).toBeChecked();
    });

    test("Check All clears every policy when all are selected", () => {
        render(<Checklist {...defaultProps} />);

        const checkAll = screen.getByLabelText(
            "Check all policy statements"
        );

        fireEvent.click(checkAll);

        expect(checkAll).toBeChecked();

        fireEvent.click(checkAll);

        expect(checkAll).not.toBeChecked();

        expect(
            screen.getByDisplayValue("Academic Integrity")
        ).not.toBeChecked();
    });

    test("Check All selects all resources", () => {
        render(<Checklist {...defaultProps} />);

        fireEvent.click(
            screen.getByLabelText("Check all resources")
        );

        expect(
            screen.getByDisplayValue(
                "Academic Success Center"
            )
        ).toBeChecked();

        expect(
            screen.getByDisplayValue("Writing Center")
        ).toBeChecked();

        expect(
            screen.getByDisplayValue(
                "Counseling and Psychological Services"
            )
        ).toBeChecked();
    });

    test("Accommodations for Students with Disabilities is always checked", () => {
        render(<Checklist {...defaultProps} />);

        const accommodations = screen.getByDisplayValue(
            "Accommodations for Students with Disabilities"
        );

        expect(accommodations).toBeChecked();

        fireEvent.click(accommodations);

        // Component currently forces this resource to remain checked
        expect(accommodations).toBeChecked();

        expect(
            screen.getByText("Required")
        ).toBeInTheDocument();
    });

    test("logs an error if fetching required inputs fails", async () => {
        const consoleSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const error = new Error("API failed");

        (fetchRequiredInputs as jest.Mock).mockRejectedValue(
            error
        );

        render(<Checklist {...defaultProps} />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Failed to fetch valid inputs:",
                error
            );
        });

        consoleSpy.mockRestore();
    });
});