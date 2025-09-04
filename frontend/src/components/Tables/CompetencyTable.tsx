import React, { useState } from "react";
import "./competencyTable.css";
import SafeIcon from "../../utils/ComponentWrapper";
import {FaPlus, FaTimes} from "react-icons/fa";

interface CompetencyTableProps {
    headers: string[];
    initialRows: string[][];
    maxRows?: number;
    variant?: "table1" | "table2"
}

const CompetencyTable: React.FC<CompetencyTableProps> = ({
                                                             headers,
                                                             initialRows,
                                                             maxRows = 6,
    variant = "table1",
                                                         }) => {
    const [rows, setRows] = useState<string[][]>(initialRows);

    const handleCellChange = (
        rowIndex: number,
        colIndex: number,
        value: string
    ) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex][colIndex] = value;
        setRows(updatedRows);
    };

    const handleAddRow = () => {
        if (rows.length >= maxRows) {
            alert("You have reached the maximum size for this table");
            return;
        }
        setRows([...rows, Array(headers.length).fill("")]);
    };

    const handleDeleteRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };
    return (
        <div className={`competency-table-wrapper ${variant}`}>
            <table className="competency-table1">
                <thead>
                <tr>
                    {headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                    ))}
                    <th className="action-header">
                        <button
                            type="button"
                            className="competency-table-button"
                            onClick={handleAddRow}
                        >
                            <SafeIcon Icon={FaPlus}/>
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td
                                key={`${rowIndex}-${colIndex}`}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                    handleCellChange(
                                        rowIndex,
                                        colIndex,
                                        e.currentTarget.innerText
                                    )
                                }
                            >
                                {cell}
                            </td>
                        ))}
                        <td className="action-cell">
                            <button
                                type="button"
                                className="competency-table-button"
                                onClick={() => handleAddRow()}
                            >
                                <SafeIcon Icon={FaPlus}/>
                            </button>
                            <button
                                type="button"
                                className="competency-table-button"
                                onClick={() => handleDeleteRow(rowIndex)}
                            >
                                <SafeIcon Icon={FaTimes}/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompetencyTable;
