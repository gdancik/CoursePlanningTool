import React, { useState } from "react";
import "./Tables/gradeTable.css";

/**
 * @function CourseSchedule
 * @description The CourseSchedule component
 * @returns {html} table with columns for Date, Unit/Theme, 
 *      Learning Outcomes, and Reading/Assignments; and
 *      buttons for adding/removing rows
 */
function CourseSchedule() {
  const [scheduleRows, setScheduleRows] = useState([
    { date: "", unit: "", learningOutcomes: "", readingAssignments: "" }
  ]);

  const AddRow = () => {
    setScheduleRows([
      ...scheduleRows,
      { date: "", unit: "", learningOutcomes: "", readingAssignments: "" },
    ]);
  };

  const RemoveRow = () => {
    if (scheduleRows.length > 1) {
      const updatedRows = scheduleRows.slice(0, -1);
      setScheduleRows(updatedRows);
    }
  };

  return (
    <div>
      <h3>Course Schedule</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Unit and Theme/Topic</th>
            <th>Learning Outcomes Addressed</th>
            <th>Reading/Assignments Due</th>
          </tr>
        </thead>
        <tbody>
          {scheduleRows.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.unit}</td>
              <td>{row.learningOutcomes}</td>
              <td>{row.readingAssignments}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={AddRow}>Add Row</button>
      <button onClick={RemoveRow}>Remove Row</button>
    </div>
  );
}
export default CourseSchedule;
