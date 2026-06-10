import React, { useEffect, useState } from "react";
import CompetencyTable from "./CompetencyTable";

const headers = ["Skill, Knowledge, or Attitude", "Competency", "Purpose", "Real-world, field, or education goal connection"];

const CompetencyTable1: React.FC<{ id: string; data?: string[][] }> = ({
                                                                           id,
                                                                           data,
                                                                       }) => {
    const [initialRows, setRows] = useState<string[][]>([
        ["Attitude", "", "", ""],
        ["Knowledge", "", "", ""],
        ["Skill", "", "", ""],
        ["Skill", "", "", ""],
    ]);

    useEffect(() => {
        if (data && data.length > 1) {
            setRows(data.slice(1));
        }
    }, [data]);

    return (
        <CompetencyTable
            id={id}
            headers={headers}
            initialRows={initialRows}
            maxRows={6}
            variant="table1"
        />
    );
};

export default CompetencyTable1;
