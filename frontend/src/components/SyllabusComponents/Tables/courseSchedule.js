import React, { useState } from "react";
import "./gradeTable.css";
import "../../../components/Button/ReusableButton.css"
import api from "../../../services/axios";

//import axios from "axios";
//import "./gradeTable.css";


/**
 * @function CourseSchedule
 * @description The CourseSchedule component
 * @returns {html} table with columns for Date, Unit/Theme, 
 *      Learning Outcomes, and Reading/Assignments; and
 *      buttons for adding/removing rows
 */

function CourseSchedule({ id, term, year, days }) {
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

  /***
  const login = async () => {
    try {
      await axios.get(
        "https://gdancik.pythonanywhere.com/api/test_login/?user=annie&password=password"
      );
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
***/

  const generateSchedule = async () => {
    try {
      //await login();

      const response = await api.post(
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

  const missingScheduleInfo = function(term, year, days) {
    console.log('checking schedule info: '+ [term, year, days])
    if ([term, year, days].some(x => x === undefined)) {
      return true;
    }
    if ([term, year, days].some(x => x.trim() === '')) {
      return true;
    }
    return false;
  }

  return (
    <div> 
      <div style = {{margin: "1%"}}>
        {(missingScheduleInfo(term, year, days))? (
          <p style = {{color: "darkred", fontWeight: "bold"}}>
            Note: for the option to autogenerate your schedule, enter a term, year, and days on the Basic Information page</p>

        ): 
      <button class = 'reusable-button primary' onClick={generateSchedule}>Generate Schedule ({term} {year}, {days}) </button>  
        }

      

      </div>     
      <table id={id} style = {{margin: "2%"}}>
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
                <textarea
                  value={row.date}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].date = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <textarea
                  value={row.day}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].day = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <textarea
                  value={row.unit}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].unit = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <textarea
                  value={row.learningOutcomes}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].learningOutcomes = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <textarea
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
    </div>
  );
}

export default CourseSchedule;

