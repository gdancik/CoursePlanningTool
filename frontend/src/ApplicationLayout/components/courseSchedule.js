import React, { useState } from "react";
import axios from "axios";
import "./gradeTable.css";

function CourseSchedule({ term, year, days }) {
  const [scheduleRows, setScheduleRows] = useState([
    {
      date: "",
      day: "",
      unit: "",
      learningOutcomes: "",
      readingAssignments: "",
    },
  ]);

  const addRow = (index) => {
    const newRow = {
      date: "",
      day: "",
      unit: "",
      learningOutcomes: "",
      readingAssignments: "",
    };
    const updatedRows = [
      ...scheduleRows.slice(0, index + 1),
      newRow,
      ...scheduleRows.slice(index + 1),
    ];
    setScheduleRows(updatedRows);
  };

  const deleteRow = (index) => {
    if (scheduleRows.length > 1) {
      const updatedRows = scheduleRows.filter(
        (row, rowIndex) => rowIndex !== index
      );
      setScheduleRows(updatedRows);
    }
  };

  const login = async () => {
    try {
      await axios.get(
        "https://gdancik.pythonanywhere.com/api/test_login/?user=annie&password=password"
      );
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const generateSchedule = async () => {
    try {
      await login();

      const response = await axios.post(
        "https://gdancik.pythonanywhere.com/api/generateSchedule/",
        { term, year, days }
      );
      const scheduleData = response.data;
      console.log("API response:", scheduleData);

      if (scheduleData.error) {
        alert(
          "Schedule can’t be generated. Please check your term, year, and days, or try again later."
        );
        return;
      }

      if (scheduleData.schedule && Array.isArray(scheduleData.schedule)) {
        const generatedSchedule = scheduleData.schedule.map((item) => ({
          date: item.Date || "",
          day: item.Day || "",
          unit: item.Description || "",
          learningOutcomes: "",
          readingAssignments: "",
        }));
        setScheduleRows(generatedSchedule);
      }
    } catch (error) {
      alert(
        "Schedule can’t be generated. Please check your term, year, and days, or try again later."
      );
      console.error("Error generating schedule", error);
    }
  };

  // Render
  return (
    <div>
      <h3>Course Schedule</h3>
      <table id="course-schedule-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Unit and Theme/Topic</th>
            <th>Learning Outcomes Addressed</th>
            <th>Reading/Assignments Due</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {scheduleRows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.date}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].date = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.day}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].day = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.unit}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].unit = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.learningOutcomes}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].learningOutcomes = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.readingAssignments}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].readingAssignments = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td className="action-btns">
                <button onClick={() => addRow(index)}>( + )</button>
                {scheduleRows.length > 1 && (
                  <button onClick={() => deleteRow(index)}>( - )</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={generateSchedule}>Generate Schedule</button>
    </div>
  );
}

export default CourseSchedule;
