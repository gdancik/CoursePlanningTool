import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ContentCardSet, CardData } from "../../../components/SyllabusComponents/ContentCardSet";
import { triggerInput } from "../../../services/triggerInput";

jest.mock("../../../services/triggerInput", () => ({
    triggerInput: jest.fn(),
}));

// Mock ContentCard so these tests stay focused on ContentCardSet behavior
jest.mock("../../../components//SyllabusComponents/ContentCard", () => {
    return function MockContentCard(props: any) {
        return (
            <div data-testid="content-card">
                <span data-testid="title-label">{props.titleLabel}</span>
                <span data-testid="description-label">
                    {props.descriptionLabel}
                </span>

                <input
                    aria-label={`title-${props.className}`}
                    value={props.titleValue}
                    placeholder={props.titlePlaceholder}
                    onChange={(e) => props.onTitleChange(e.target.value)}
                />

                <textarea
                    aria-label={`description-${props.className}`}
                    value={props.descriptionValue}
                    placeholder={props.descriptionPlaceholder}
                    onChange={(e) =>
                        props.onDescriptionChange(e.target.value)
                    }
                />

                {props.onRightValueChange && (
                    <input
                        aria-label={`right-${props.className}`}
                        value={props.rightValue ?? ""}
                        onChange={(e) =>
                            props.onRightValueChange(e.target.value)
                        }
                    />
                )}
            </div>
        );
    };
});

describe("ContentCardSet", () => {
    const defaultProps = {
        id: "learning_outcomes",
        setTitle: "Learning Outcomes",
        titleLabel: "Learning Outcome {index} Title:",
        descriptionLabel: "Learning Outcome {index} Description:",
        initialCards: [] as CardData[],
        onChange: jest.fn(),
        minCards: 2,
        maxCards: 4,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the set title", () => {
        render(<ContentCardSet {...defaultProps} />);

        expect(
            screen.getByRole("heading", {
                name: "Learning Outcomes",
            })
        ).toBeInTheDocument();
    });

    test("renders the optional preface when provided", () => {
        render(
            <ContentCardSet
                {...defaultProps}
                setPreface="Enter your course learning outcomes below."
            />
        );

        expect(
            screen.getByText(
                "Enter your course learning outcomes below."
            )
        ).toBeInTheDocument();
    });

    test("does not render a preface when one is not provided", () => {
        render(<ContentCardSet {...defaultProps} />);

        expect(
            screen.queryByText(
                "Enter your course learning outcomes below."
            )
        ).not.toBeInTheDocument();
    });

    test("creates the minimum number of cards when initialCards is empty", () => {
        render(<ContentCardSet {...defaultProps} />);

        expect(screen.getAllByTestId("content-card")).toHaveLength(2);
    });

    test("uses initialCards when they are provided", () => {
        const initialCards: CardData[] = [
            {
                title: "Outcome One",
                description: "Description One",
            },
            {
                title: "Outcome Two",
                description: "Description Two",
            },
            {
                title: "Outcome Three",
                description: "Description Three",
            },
        ];

        render(
            <ContentCardSet
                {...defaultProps}
                initialCards={initialCards}
            />
        );

        expect(screen.getAllByTestId("content-card")).toHaveLength(3);

        expect(
            screen.getByDisplayValue("Outcome One")
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("Outcome Three")
        ).toBeInTheDocument();
    });

    test("formats labels using the card index", () => {
        render(<ContentCardSet {...defaultProps} />);

        const titleLabels = screen.getAllByTestId("title-label");
        const descriptionLabels =
            screen.getAllByTestId("description-label");

        expect(titleLabels[0]).toHaveTextContent(
            "Learning Outcome 1 Title:"
        );
        expect(titleLabels[1]).toHaveTextContent(
            "Learning Outcome 2 Title:"
        );

        expect(descriptionLabels[0]).toHaveTextContent(
            "Learning Outcome 1 Description:"
        );
        expect(descriptionLabels[1]).toHaveTextContent(
            "Learning Outcome 2 Description:"
        );
    });

    test("calls onChange when a card title changes", () => {
        const onChange = jest.fn();

        const initialCards: CardData[] = [
            {
                title: "Old title",
                description: "Description",
            },
            {
                title: "Second",
                description: "Second description",
            },
        ];

        render(
            <ContentCardSet
                {...defaultProps}
                initialCards={initialCards}
                onChange={onChange}
            />
        );

        fireEvent.change(
            screen.getByLabelText("title-content-card-1"),
            {
                target: {
                    value: "Updated title",
                },
            }
        );

        expect(onChange).toHaveBeenCalledWith([
            {
                title: "Updated title",
                description: "Description",
            },
            {
                title: "Second",
                description: "Second description",
            },
        ]);
    });

    test("calls onChange when a description changes", () => {
        const onChange = jest.fn();

        const initialCards: CardData[] = [
            {
                title: "Outcome",
                description: "Old description",
            },
            {
                title: "Outcome 2",
                description: "Description 2",
            },
        ];

        render(
            <ContentCardSet
                {...defaultProps}
                initialCards={initialCards}
                onChange={onChange}
            />
        );

        fireEvent.change(
            screen.getByLabelText("description-content-card-1"),
            {
                target: {
                    value: "New description",
                },
            }
        );

        expect(onChange).toHaveBeenCalledWith([
            {
                title: "Outcome",
                description: "New description",
            },
            {
                title: "Outcome 2",
                description: "Description 2",
            },
        ]);
    });

    test("adds the id only after the user changes card content", () => {
        const { container } = render(
            <ContentCardSet {...defaultProps} />
        );

        const cardSet = container.querySelector(".content-card-set");

        expect(cardSet).not.toHaveAttribute("id");

        fireEvent.change(
            screen.getByLabelText("title-content-card-1"),
            {
                target: {
                    value: "Changed",
                },
            }
        );

        expect(cardSet).toHaveAttribute(
            "id",
            "learning_outcomes"
        );
    });

    test("adds a new card when Add is clicked", () => {
        const onChange = jest.fn();

        render(
            <ContentCardSet
                {...defaultProps}
                onChange={onChange}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /add learning outcomes/i,
            })
        );

        expect(screen.getAllByTestId("content-card")).toHaveLength(3);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("does not add more cards after reaching maxCards", () => {
        render(
            <ContentCardSet
                {...defaultProps}
                minCards={2}
                maxCards={3}
            />
        );

        const addButton = screen.getByRole("button", {
            name: /add learning outcomes/i,
        });

        fireEvent.click(addButton);

        expect(screen.getAllByTestId("content-card")).toHaveLength(3);
        expect(addButton).toBeDisabled();
    });

    test("shows delete buttons only when card count is greater than minCards", () => {
        const { rerender } = render(
            <ContentCardSet {...defaultProps} />
        );

        expect(
            screen.queryByRole("button", {
                name: /delete/i,
            })
        ).not.toBeInTheDocument();

        rerender(
            <ContentCardSet
                {...defaultProps}
                initialCards={[
                    {
                        title: "One",
                        description: "One",
                    },
                    {
                        title: "Two",
                        description: "Two",
                    },
                    {
                        title: "Three",
                        description: "Three",
                    },
                ]}
            />
        );

        expect(
            screen.getAllByRole("button", {
                name: /delete/i,
            })
        ).toHaveLength(3);
    });

    test("deletes a card and calls triggerInput", () => {
        const onChange = jest.fn();

        const initialCards: CardData[] = [
            {
                title: "One",
                description: "Description 1",
            },
            {
                title: "Two",
                description: "Description 2",
            },
            {
                title: "Three",
                description: "Description 3",
            },
        ];

        render(
            <ContentCardSet
                {...defaultProps}
                initialCards={initialCards}
                onChange={onChange}
            />
        );

        fireEvent.click(
            screen.getByTitle("Delete learning outcome 2")
        );

        expect(onChange).toHaveBeenCalledWith([
            {
                title: "One",
                description: "Description 1",
            },
            {
                title: "Three",
                description: "Description 3",
            },
        ]);

        expect(triggerInput).toHaveBeenCalledTimes(1);
    });

    test("renders and updates rightValue when showRightValue is true", () => {
        const onChange = jest.fn();

        const cards: CardData[] = [
            {
                title: "Assignment",
                description: "Assignment description",
                rightValue: "10",
            },
            {
                title: "Assignment 2",
                description: "Description 2",
                rightValue: "20",
            },
        ];

        render(
            <ContentCardSet
                {...defaultProps}
                initialCards={cards}
                onChange={onChange}
                showRightValue
                rightLabel="Points:"
            />
        );

        fireEvent.change(
            screen.getByLabelText("right-content-card-1"),
            {
                target: {
                    value: "15",
                },
            }
        );

        expect(onChange).toHaveBeenCalledWith([
            {
                title: "Assignment",
                description: "Assignment description",
                rightValue: "15",
            },
            {
                title: "Assignment 2",
                description: "Description 2",
                rightValue: "20",
            },
        ]);
    });

    test("does not render rightValue input when showRightValue is false", () => {
        render(<ContentCardSet {...defaultProps} />);

        expect(
            screen.queryByLabelText("right-content-card-1")
        ).not.toBeInTheDocument();
    });

    test("updates cards when initialCards changes", () => {
        const { rerender } = render(
            <ContentCardSet {...defaultProps} />
        );

        rerender(
            <ContentCardSet
                {...defaultProps}
                initialCards={[
                    {
                        title: "Loaded from formData",
                        description: "Loaded description",
                    },
                ]}
            />
        );

        expect(
            screen.getByDisplayValue("Loaded from formData")
        ).toBeInTheDocument();
    });

    test("uses an empty title for new cards when separateLabel is true", () => {
        render(
            <ContentCardSet
                {...defaultProps}
                separateLabel
            />
        );

        const titleInputs = screen.getAllByLabelText(
            /title-content-card/i
        );

        expect(titleInputs[0]).toHaveValue("");
        expect(titleInputs[1]).toHaveValue("");
    });
});