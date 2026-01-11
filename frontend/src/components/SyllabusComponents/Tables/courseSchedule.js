import React, { useState, useEffect } from "react";
import "./gradeTable.css";
import "../../../components/Button/ReusableButton.css"
import {triggerInput} from "../../../services/triggerInput"
import api from "../../../services/axios";

//import axios from "axios";
//import "./gradeTable.css";


/**
 * @function CourseSchedule
 * @note: refactor this using typescript and change to @param
 * @description The CourseSchedule component
 * param {string} id - The id of the table element
 * param {string} [term] - The course term (e.g., 'Spring')
 * param {string} [year] - The course year (e.g., '2026')
 * param {string} [days] - The days of the course (e.g., 'MWF')
 * param {string} [data] - data to populate the table, as
 *            a JSON string corresponding to a nested array; 
 * @returns {html} table with columns for Date, Unit/Theme, 
 *      Learning Outcomes, and Reading/Assignments; and
 *      buttons for adding/removing rows, and generate 
 *      schedule button
 */

function CourseSchedule({ id, term, year, days, data }) {

  // populate table if data is provided
  useEffect(() => {

    if (data !== undefined) {
      console.log('effect data: ' + data);   
      
      // skip header (header will not be changed))
      const pdata = JSON.parse(data);
      const [header, ...body] = pdata;
      const bodyObjectArray = body.map(createRow);

      setScheduleRows(bodyObjectArray);    
    } 
  }, [data]); // Empty dependency array


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
    triggerInput();
    setScheduleRows(updatedRows);
  };

  const deleteRow = (index) => {
    if (scheduleRows.length > 1) {
      const updatedRows = scheduleRows.filter(
        (row, rowIndex) => rowIndex !== index
      );
      triggerInput();
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
 
  const createRow = function(x) {
      const keys = ['date', 'day', 'unit', 'learningOutcomes', 'readingAssignments' ];
      const obj = Object.fromEntries(keys.map( (k,i) => [k,x[i]]));
      return obj;
  }

  // scheduleData has schedule
  const generateSchedule = async () => {
   
   // Or, if you specifically want a 'change' event
   //const changeEvent = new Event('change', { bubbles: true });
   //textarea.dispatchEvent(changeEvent);  


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
          "Schedule can’t be generated. Please ensure valid term, year, and days, or try again later."
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
        triggerInput();
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
        <div style = {{display: "flex"}}>
          <button class = 'reusable-button primary' 
            onClick={generateSchedule}>Generate Schedule ({term} {year}, {days})
          </button>. &nbsp;
          <button style = {{all: "unset"}}> (Note: this will overwrite the current schedule)</button>          
          </div>          
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

