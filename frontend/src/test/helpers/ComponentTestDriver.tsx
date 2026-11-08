
import React, { useState } from "react";
import { screen } from "@testing-library/react";

import { JsonRenderComponent } from "../../utils/PageRenderEngine/jsonRenderer";
import { ComponentRegistry } from "../../utils/PageRenderEngine/ComponentRegistry";

import {
    FormState,
    FormValue,
    JsonComponent
} from "../../utils/PageRenderEngine/types";

import { ProviderRenderer } from "./ProviderRenderer";

export interface ComponentTestDefinition {
    name: string;
    component: JsonComponent;
    formData?: FormState;
    expectedText?: string | string[];
    interaction?: (onChange: jest.Mock) => Promise<void> | void;
}

interface TestHarnessProps {
    component: JsonComponent;
    initialFormData: FormState;
    onChangeSpy: jest.Mock;
}

function TestHarness({
    component,
    initialFormData,
    onChangeSpy
}: TestHarnessProps) {
    const [formData, setFormData] = useState<FormState>(initialFormData);

    const handleChange = (fieldId: string, value: FormValue) => {
        onChangeSpy(fieldId, value);

        setFormData(previous => ({
            ...previous,
            [fieldId]: value
        }));
    };

    return (
        <JsonRenderComponent
            component={component}
            formData={formData}
            onChange={handleChange}
        />
    );
}

export function runComponentTests(
    definitions: ComponentTestDefinition[]
): void {
    describe("JSON Components", () => {
        test("Every registered component has a test definition", () => {
            const registeredTypes = Object.keys(ComponentRegistry).sort();

            const testedTypes = definitions
                .map(definition => definition.component.type)
                .sort();

            expect(testedTypes).toEqual(registeredTypes);
        });

        test("Every test definition has a unique name", () => {
            const names = definitions.map(definition => definition.name);

            expect(new Set(names).size).toBe(names.length);
        });

        test.each(definitions)(
            "$name",
            async ({
                component,
                formData = {},
                expectedText,
                interaction
            }: ComponentTestDefinition) => {
                const onChange = jest.fn();

                const { container } = ProviderRenderer(
                    <TestHarness
                        component={component}
                        initialFormData={formData}
                        onChangeSpy={onChange}
                    />
                );

                expect(container).not.toBeEmptyDOMElement();

                if (expectedText !== undefined) {
                    const values = Array.isArray(expectedText)
                        ? expectedText
                        : [expectedText];

                    values.forEach(value => {
                        expect(
                            screen.getByText(value)
                        ).toBeInTheDocument();
                    });
                }

                if (interaction) {
                    await interaction(onChange);
                }
            }
        );
    });
}
