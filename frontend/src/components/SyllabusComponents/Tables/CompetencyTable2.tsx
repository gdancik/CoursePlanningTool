import React from "react";
import CompetencyTable from "./CompetencyTable";

const headers = ["Competency", "Outcome"];

const initialRows = [
    [
        "Utilize critical thinking skills to create policy recommendations for criminal justice reform in Connecticut",
        "Recommend criminal justice policy outcomes for the State of Connecticut based on critical analysis of multiple policy solutions",
    ],
    ["", ""],
    ["", ""],
];

const CompetencyTable2: React.FC = () => {
    return (
        <CompetencyTable
            headers={headers}
            initialRows={initialRows}
            maxRows={6}
            variant = "table2"
        />
    );
};

export default CompetencyTable2;
