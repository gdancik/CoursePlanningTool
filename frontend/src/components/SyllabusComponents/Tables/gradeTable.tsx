import React from "react";
import "./GradeTable.css";

export interface GradeTableProps {
    id: string;
    data?: [string, string][];
    onChange?: (updated: [string, string][]) => void;
}


const GradeTable: React.FC<GradeTableProps> = ({ id, data, onChange }) => {

    const gradeLetters = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

    const defaultIntervals = [
        "94-100",
        "90-93",
        "86-89",
        "82-85",
        "79-81",
        "75-78",
        "71-74",
        "67-70",
        "62-66",
        "55-61",
        "> 55",
    ];

    const rows: [string, string][] = gradeLetters.map((letter, i) => {
        if(data && data[i] && data[i][0]){
            return [letter, data[i][1]];
        }
        return [letter, defaultIntervals[i]];
     });
}