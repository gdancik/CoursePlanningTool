
import { fireEvent, screen } from "@testing-library/react";

import {
    ComponentTestDefinition,
    runComponentTests
} from "../../helpers/ComponentTestDriver";

const components: ComponentTestDefinition[] = [
    // ---------- Basic Components ----------

    {
        name: "Alert renders",
        component: {
            type: "Alert",
            text: "Test Alert"
        },
        expectedText: "Test Alert"
    },

    {
        name: "Information renders",
        component: {
            type: "Information",
            text: "Test Information"
        },
        expectedText: "Test Information"
    },

    {
        name: "Button renders",
        component: {
            type: "Button",
            label: "Test Button"
        },
        expectedText: "Test Button"
    },

    // ---------- Form Components ----------

    {
        name: "Text input renders and accepts input",
        component: {
            type: "text",
            id: "test-text",
            label: "Test Text",
            placeholder: "Enter text"
        },
        formData: {
            "test-text": ""
        },
        expectedText: "Test Text",

        interaction: (onChange) => {
            const input = screen.getByRole("textbox", {
                name: "Test Text"
            });

            fireEvent.change(input, {
                target: {
                    value: "Hello"
                }
            });

            expect(input).toHaveValue("Hello");

            expect(onChange).toHaveBeenCalledWith(
                "test-text",
                "Hello"
            );
        }
    },

    {
        name: "Textarea renders and accepts input",
        component: {
            type: "textarea",
            id: "test-textarea",
            label: "Test Textarea",
            placeholder: "Enter text"
        },
        formData: {
            "test-textarea": ""
        },
        expectedText: "Test Textarea",

        interaction: (onChange) => {
            const textarea = screen.getByRole("textbox", {
                name: /Test Textarea/i
            });

            fireEvent.change(textarea, {
                target: {
                    value: "Testing"
                }
            });

            expect(textarea).toHaveValue("Testing");

            expect(onChange).toHaveBeenCalledWith(
                "test-textarea",
                "Testing"
            );
        }
    },

    {
        name: "Select renders and responds to selection",
        component: {
            type: "select",
            id: "test-select",
            label: "Test Select",
            options: ["One", "Two"]
        },
        formData: {
            "test-select": ""
        },
        expectedText: "Test Select",

        interaction: (onChange) => {
            const select = screen.getByRole("combobox", {
                name: "Test Select"
            });

            fireEvent.change(select, {
                target: {
                    value: "Two"
                }
            });

            expect(onChange).toHaveBeenCalled();
        }
    },

    {
        name: "Checkbox renders and responds to clicks",
        component: {
            type: "checkbox",
            id: "test-checkbox",
            label: "Test Checkbox"
        },
        formData: {
            "test-checkbox": false
        },
        expectedText: "Test Checkbox",

        interaction: (onChange) => {
            const checkbox = screen.getByRole("checkbox", {
                name: "Test Checkbox"
            });

            fireEvent.click(checkbox);

            expect(onChange).toHaveBeenCalledWith(
                "test-checkbox",
                true
            );

            expect(checkbox).toBeChecked();
        }
    },

    {
        name: "Checkbox group renders and responds to selection",
        component: {
            type: "CheckboxGroup",
            id: "test-group",
            label: "Test Group",
            data: ["One", "Two"]
        },
        formData: {
            "test-group": []
        },
        expectedText: "Test Group",

        interaction: (onChange) => {
            const checkboxes = screen.getAllByRole("checkbox");

            expect(checkboxes.length).toBeGreaterThan(0);

            fireEvent.click(checkboxes[0]);

            expect(onChange).toHaveBeenCalled();
        }
    },

    // ---------- Rendering Components ----------

    {
        name: "Image renders",
        component: {
            type: "Image",
            value: "test-image.png",
            alt: "Test Image"
        },

        interaction: () => {
            const image = screen.getByRole("img", {
                name: "Test Image"
            });

            expect(image).toBeInTheDocument();
        }
    },

    {
        name: "Information Text renders",
        component: {
            type: "informationText",
            placeholder: "Test Information Text"
        }
    },

    {
        name: "Paragraph from file renders",
        component: {
            type: "paragraphFromFile",
            file: "test.txt"
        }
    },

    {
        name: "HTML from file renders",
        component: {
            type: "htmlFromFile",
            file: "test.html"
        }
    },

    // ---------- Container Components ----------

    {
        name: "Row renders",
        component: {
            type: "Row",
            content: [
                {
                    type: "Information",
                    text: "Row Child"
                }
            ]
        },
        expectedText: "Row Child"
    },

    {
        name: "Column renders",
        component: {
            type: "Column",
            content: [
                {
                    type: "Information",
                    text: "Column Child"
                }
            ]
        },
        expectedText: "Column Child"
    },

    {
        name: "Accordion renders",
        component: {
            type: "Accordion",
            title: "Test Accordion",
            content: [
                {
                    type: "Information",
                    text: "Accordion Child"
                }
            ]
        },
        expectedText: "Test Accordion"
    },

    {
        name: "Sidebar Layout renders",
        component: {
            type: "SidebarLayout",
            title: "Test Sidebar",
            content: [
                {
                    type: "Information",
                    text: "Main Content"
                }
            ],
            sidebarContent: [
                {
                    type: "Information",
                    text: "Sidebar Content"
                }
            ]
        },
        expectedText: [
            "Main Content",
            "Sidebar Content"
        ]
    },

    // ---------- Data / Complex Components ----------

    {
        name: "Grade Table renders",
        component: {
            type: "GradeTable",
            id: "test-grade-table",
            data: [
                ["A", "90-100"],
                ["B", "80-89"]
            ]
        },
        formData: {
            "test-grade-table": [
                ["A", "90-100"],
                ["B", "80-89"]
            ]
        }
    },

    {
        name: "Course Schedule renders",
        component: {
            type: "courseSchedule",
            id: "test-course-schedule",
            term: "Fall",
            year: "2026",
            days1: "MWF"
        },
        formData: {
            "test-course-schedule": []
        }
    },

    {
        name: "Assignments renders",
        component: {
            type: "Assignments",
            id: "test-assignments"
        }
    },

    {
        name: "Grading Policies renders",
        component: {
            type: "GradingPolicies",
            id: "test-grading-policies"
        }
    },

    {
        name: "Learning Outcomes Cards renders",
        component: {
            type: "LearningOutcomesCards",
            id: "test-learning-outcomes"
        }
    },

    {
        name: "Checklist renders",
        component: {
            type: "ChecklistComponent"
        }
    },

    {
        name: "Competency Table 1 renders",
        component: {
            type: "CompetencyTable1",
            id: "test-competency-1"
        }
    },

    {
        name: "Competency Table 2 renders",
        component: {
            type: "CompetencyTable2",
            id: "test-competency-2"
        }
    },

    // ---------- Special Components ----------

    {
        name: "Five Core Competencies renders",
        component: {
            type: "FiveCoreCompetencies",
            competencies: []
        }
    },

    {
        name: "Additional Competencies renders",
        component: {
            type: "AdditionalCompetencies"
        }
    },

    {
        name: "Blooms Taxonomy renders",
        component: {
            type: "BloomsTaxonomy"
        }
    },

    {
        name: "Overview renders",
        component: {
            type: "OverviewComponent"
        }
    }
];

runComponentTests(components);
