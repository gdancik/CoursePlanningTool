import { FormState } from "../../utils/PageRenderEngine/types";

export const getDefaultGradingPolicies = (): FormState => {
    return {
        grade_table_syllabus_list: JSON.stringify([
            ["Grade", "Percentage Interval"],
            ["A", "94-100%"],
            ["A-", "90-93%"],
            ["B+", "87-89%"],
            ["B", "83-86%"],
            ["B-", "80-82%"],
            ["C+", "77-79%"],
            ["C", "73-76%"],
            ["C-", "70-72%"],
            ["D+", "67-69%"],
            ["D", "60-66%"],
            ["F", "<60%"],
        ]),
    };
};