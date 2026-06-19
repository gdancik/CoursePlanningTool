import {FormState} from "../../utils/PageRenderEngine/types";

export const getDefaultGradingPolicies = (): FormState => {
    return {
        grade_table: JSON.stringify([
            ["A", "93", "100"],
            ["A-", "90", "92"],
            ["B+", "87", "89"],
            ["B", "83", "86"],
            ["B-", "80", "82"],
            ["C+", "77", "79"],
            ["C", "73", "76"],
            ["C-", "70", "72"],
            ["D+", "67", "69"],
            ["D", "63", "66"],
            ["D-", "60", "62"],
            ["F", "0", "59"],
        ]),
    };
};