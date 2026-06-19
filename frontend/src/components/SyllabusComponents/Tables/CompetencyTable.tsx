import React, { useState, useEffect, useRef } from "react";
import { triggerInput } from "../../../services/triggerInput";
import "./competencyTable.css";
import SafeIcon from "../../../utils/course/ComponentWrapper";
import { FaPlus, FaTimes } from "react-icons/fa";

interface CompetencyTableProps {
  id: string;
  headers: string[];
  initialRows: string[][];
  maxRows?: number;
  variant?: "table1" | "table2";
}

type Row = {
  id: string;
  cells: string[];
};

const CompetencyTable: React.FC<CompetencyTableProps> = ({
  id,
  headers,
  initialRows,
  maxRows = 6,
  variant = "table1",
}) => {
  const prevInitialRows = useRef(initialRows);

  // Initialize rows once
  const [rows, setRows] = useState<Row[]>(() =>
    initialRows.map((cells) => ({
      id: crypto.randomUUID(),
      cells: [...cells],
    }))
  );

  // Sync with parent if initialRows truly changes
  useEffect(() => {
    const changed =
      prevInitialRows.current.length !== initialRows.length ||
      prevInitialRows.current.some((r, i) =>
        r.some((cell, j) => cell !== initialRows[i][j])
      );

    if (changed) {
      setRows(
        initialRows.map((cells) => ({
          id: crypto.randomUUID(),
          cells: [...cells],
        }))
      );
      prevInitialRows.current = initialRows;
    }
  }, [initialRows]);

  // Update a single cell
  const handleCellChange = (rowId: string, colIndex: number, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, cells: row.cells.map((cell, i) => (i === colIndex ? value : cell)) }
          : row
      )
    );
  };

  // Add a new empty row
  const handleAddRow = () => {
    if (rows.length >= maxRows) {
      alert("You have reached the maximum size for this table");
      return;
    }

    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), cells: Array(headers.length).fill("") },
    ]);
  };


  // Delete a row
  const handleDeleteRow = (rowId: string) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId));
    triggerInput();
  };

  return (
    <div className={`competency-table-wrapper ${variant}`}>
      <table id={id} className="competency-table1">
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
                <SafeIcon Icon={FaPlus} />
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, colIndex) => (
                <td key={`${row.id}-${colIndex}`}>
                  <textarea                    
                    value={cell}                    
                    onChange={(e) => handleCellChange(row.id, colIndex, e.target.value)}
                    className="competency-table-input"
                     style={{ width: "100%", height: "80px", overflowY: "auto" }}
                  />
                </td>
              ))}
              <td className="adction-cell">
               <div style={{
                        display: "flex",
                        flexDirection: "row",  // row | column
                        justifyContent: "center", // align items horizontally
                        alignItems: "center"     // align items vertically                        
                    }}
                >
                <button
                  type="button"
                  className="competency-table-button"
                  onClick={handleAddRow}
                >
                  <SafeIcon Icon={FaPlus} />
                </button>
                <button
                  type="button"
                  className="competency-table-button"
                  onClick={() => handleDeleteRow(row.id)}
                >
                  <SafeIcon Icon={FaTimes} />
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompetencyTable;
