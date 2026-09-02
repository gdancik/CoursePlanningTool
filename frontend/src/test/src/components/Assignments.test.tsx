import React from "react";
import {getByText, render, screen} from "@testing-library/react"
import Assignments from "../../../components/SyllabusComponents/Assignments";
import { syllabusTestData } from "../../fixtures/syllabusTestData";

test('Assignment component load testor from data', () => {
    render(
    <Assignments
    id = "assmt_assignments_syllabus_json"
    data = {syllabusTestData.assmt_assignments_syllabus_json}
    />
);

/**
 * Assignment one
 */

expect(screen.getByDisplayValue("Assignment one")).toBeInTheDocument();
expect (screen.getByDisplayValue("5%")).toBeInTheDocument();
expect (screen.getByDisplayValue("This assignment is used to test an assignment")).toBeInTheDocument();

/**
 * Assignment two
 */
expect(screen.getByDisplayValue("Assignment two")).toBeInTheDocument();
expect (screen.getByDisplayValue("10%")).toBeInTheDocument();
expect (screen.getByDisplayValue("This assignment is used to test an assignment for second one")).toBeInTheDocument();
})