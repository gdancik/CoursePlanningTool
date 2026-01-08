import React from "react";
import CompetencyTable from "./CompetencyTable";

const headers = ["Skill, Knowledge, or Attitude", "Competency", "Purpose", "Real-world, field, or education goal connection"];

const initialRows = [
    ["Attitude", "", "", ""],
    ["Knowledge", "", "", ""],
    ["Skill", "", "", ""],
    ["Skill", "", "", ""],
];

const CompetencyTable1: React.FC<{ id: string }> = ({ id }) => {
    return (
        <CompetencyTable
            id={id}
            headers={headers}
            initialRows={initialRows}
            maxRows={6}
            variant = "table1"
        />
    );
};

export default CompetencyTable1;
