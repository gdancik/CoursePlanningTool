import React, { useEffect, useState } from "react";
import CompetencyTable from "./CompetencyTable";

const headers = ["Competency", "Outcome"];



const CompetencyTable2: React.FC<{ id: string, data?:[] }> = ({ id, data }) => {


    const [initialRows, setRows] = useState<string[][]>(
        [
            [
                "Utilize critical thinking skills to create policy recommendations for criminal justice reform in Connecticut",
                "Recommend criminal justice policy outcomes for the State of Connecticut based on critical analysis of multiple policy solutions",
            ],
            ["", ""],
            ["", ""],
        ]
    );


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
            variant = "table2"
        />
    );
};

export default CompetencyTable2;
