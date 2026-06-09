import React, { useState, useEffect } from "react";
import "./gradeTable.css";
import "../../../components/Button/ReusableButton.css"
import {triggerInput} from "../../../services/triggerInput"
import api from "../../../services/apiClient";
import config from "../../../config.json";

//import axios from "axios";
//import "./gradeTable.css";

const createEmptyScheduleRow = () => ({
  date: "",
  day: "",
  unit: "",
  learningOutcomes: "",
  readingAssignments: "",
  dateTimestamp: Number.POSITIVE_INFINITY,
  sortableDateTimestamp: Number.POSITIVE_INFINITY,
});

const resolveDefaultYear = (defaultYear) => {
  const parsedDefaultYear = Number(defaultYear);
  if (Number.isInteger(parsedDefaultYear) && parsedDefaultYear > 0) {
    return parsedDefaultYear;
  }

  return new Date().getFullYear();
};

const parseStandaloneDateValue = (dateValue, defaultYear) => {
  const value = (dateValue || "").trim();
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const normalizedDefaultYear = resolveDefaultYear(defaultYear);

  const numericDateMatch = value.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/);
  if (numericDateMatch) {
    const month = Number(numericDateMatch[1]);
    const day = Number(numericDateMatch[2]);
    const rawYear = numericDateMatch[3] ? Number(numericDateMatch[3]) : normalizedDefaultYear;
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const normalizedYear = rawYear < 100 ? 2000 + rawYear : rawYear;
      return new Date(normalizedYear, month - 1, day).getTime();
    }
  }

  const monthNameDateMatch = value.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:,\s*(\d{2,4}))?$/);
  if (monthNameDateMatch) {
    const month = Date.parse(`${monthNameDateMatch[1]} 1, 2000`);
    const day = Number(monthNameDateMatch[2]);
    const rawYear = monthNameDateMatch[3] ? Number(monthNameDateMatch[3]) : normalizedDefaultYear;
    if (!Number.isNaN(month) && day >= 1 && day <= 31) {
      const monthIndex = new Date(month).getMonth();
      const normalizedYear = rawYear < 100 ? 2000 + rawYear : rawYear;
      return new Date(normalizedYear, monthIndex, day).getTime();
    }
  }

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  return Number.POSITIVE_INFINITY;
};

const parseSortableRowDateValue = (dateValue, defaultYear) => {
  const value = (dateValue || "").trim();
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const leadingDateMatch = value.match(/^([A-Za-z]{3,9}\s+\d{1,2}(?:,\s*\d{2,4})?|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)/);
  if (leadingDateMatch) {
    return parseStandaloneDateValue(leadingDateMatch[1], defaultYear);
  }

  return parseStandaloneDateValue(value, defaultYear);
};

const sortRowsByDate = (rows, defaultYear) =>
  rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const dateA = Number.isFinite(a.row.sortableDateTimestamp)
        ? a.row.sortableDateTimestamp
        : parseSortableRowDateValue(a.row.date, defaultYear);
      const dateB = Number.isFinite(b.row.sortableDateTimestamp)
        ? b.row.sortableDateTimestamp
        : parseSortableRowDateValue(b.row.date, defaultYear);

      if (dateA !== dateB) {
        return dateA - dateB;
      }

      return a.index - b.index;
    })
    .map((entry) => entry.row);

const toDeduplicationKey = (row) =>
  [
    row.date,
    row.day,
    row.unit,
    row.learningOutcomes,
    row.readingAssignments,
  ]
    .map((value) => (value || "").trim().toLowerCase())
    .join("|");

const deduplicateRows = (rows) => {
  const seenKeys = new Set();
  return rows.filter((row) => {
    const key = toDeduplicationKey(row);
    if (seenKeys.has(key)) {
      return false;
    }
    seenKeys.add(key);
    return true;
  });
};

const coerceToTrimmedString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join("").trim();
  }

  return String(value).trim();
};

const normalizeTerm = (value) => {
  const trimmed = coerceToTrimmedString(value);
  if (!trimmed) {
    return "";
  }

  const lower = trimmed.toLowerCase();
  if (lower === "fall") {
    return "Fall";
  }
  if (lower === "spring") {
    return "Spring";
  }

  return trimmed;
};

const normalizeYear = (value) => {
  const trimmed = coerceToTrimmedString(value);
  const yearMatch = trimmed.match(/\d{4}/);
  return yearMatch ? yearMatch[0] : trimmed;
};

const normalizeDays = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(value.map((day) => String(day).trim().toUpperCase()).join("").split(""))]
      .filter((day) => "MTWRFS".includes(day))
      .join("");
  }

  const raw = coerceToTrimmedString(value);
  if (!raw) {
    return "";
  }

  let normalized = raw;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      normalized = parsed.join("");
    }
  } catch {
    normalized = raw;
  }

  return [...new Set(normalized.toUpperCase().replace(/[^MTWRFS]/g, "").split(""))].join("");
};

const formatDate = (timestamp, format) => {
  if (timestamp === Number.POSITIVE_INFINITY) return "";
  const d = new Date(timestamp);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  if (format === "mm/dd") return `${mm}/${dd}`;
  if (format === "mm/dd/yy") return `${mm}/${dd}/${String(d.getFullYear()).slice(-2)}`;
  return `${mm}/${dd}/${d.getFullYear()}`;
};

const withParsedDateMetadata = (row, defaultYear) => {
  const standaloneTimestamp = parseStandaloneDateValue(row.date, defaultYear);
  const sortableTimestamp = parseSortableRowDateValue(row.date, defaultYear);

  return {
    ...row,
    dateTimestamp: standaloneTimestamp,
    sortableDateTimestamp: sortableTimestamp,
  };
};


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
      //console.log('effect data: ' + data);   
      
      // skip header (header will not be changed))
      const pdata = JSON.parse(data);
      const [header, ...body] = pdata;
      const bodyObjectArray = body.map(createRow).map((row) => withParsedDateMetadata(row, normalizedYear));

      setScheduleRows(bodyObjectArray);    
    } 
  }, [data]); // Empty dependency array


  const [scheduleRows, setScheduleRows] = useState([
    createEmptyScheduleRow(),
  ]);

  const [dateFormat, setDateFormat] = useState("mm/dd/yyyy");

  const normalizedTerm = normalizeTerm(term);
  const normalizedYear = normalizeYear(year);
  const normalizedDays = normalizeDays(days);

  const datesSorted = scheduleRows.length <= 1 || scheduleRows.every((row, i) => {
    if (i === 0) return true;
    const previousTimestamp = Number.isFinite(scheduleRows[i - 1].sortableDateTimestamp)
      ? scheduleRows[i - 1].sortableDateTimestamp
      : parseSortableRowDateValue(scheduleRows[i - 1].date, normalizedYear);
    const currentTimestamp = Number.isFinite(row.sortableDateTimestamp)
      ? row.sortableDateTimestamp
      : parseSortableRowDateValue(row.date, normalizedYear);

    return previousTimestamp <= currentTimestamp;
  });

  useEffect(() => {
    setScheduleRows((currentRows) =>
      currentRows.map((row) => {
        const ts = Number.isFinite(row.dateTimestamp)
          ? row.dateTimestamp
          : parseStandaloneDateValue(row.date, normalizedYear);
        if (ts === Number.POSITIVE_INFINITY) return row;
        return { ...row, date: formatDate(ts, dateFormat), dateTimestamp: ts };
      })
    );
    triggerInput();
  }, [dateFormat, normalizedYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const addRow = (index) => {
    const newRow = createEmptyScheduleRow();
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
      return withParsedDateMetadata(obj, normalizedYear);
  }

  const clearSchedule = () => {
    const clearedRows = scheduleRows.length > 0
      ? scheduleRows.map(() => createEmptyScheduleRow())
      : [createEmptyScheduleRow()];
    setScheduleRows(clearedRows);
    triggerInput();
  };

  const sortScheduleByDate = () => {
    setScheduleRows((currentRows) => sortRowsByDate(currentRows, normalizedYear));
    triggerInput();
  };

  // scheduleData has schedule
  const generateSchedule = async () => {
    try {
      if (missingScheduleInfo(normalizedTerm, normalizedYear, normalizedDays)) {
        alert("Please provide valid term, year, and days before generating a schedule.");
        return;
      }

      const scheduleData = await api
          .post("generateSchedule/", {
            json: {
              term: normalizedTerm,
              year: normalizedYear,
              days: normalizedDays,
            },
          })
          .json();

      if (config.log) {
        console.log("API response:", scheduleData);
      }

      if (scheduleData.error) {
        alert(
            `Schedule can’t be generated: ${scheduleData.error}`
        );
        return;
      }

      if (scheduleData.schedule && Array.isArray(scheduleData.schedule)) {
        const generatedSchedule = scheduleData.schedule
            .map((item) => ({
              date: item.Date || "",
              day: item.Day || "",
              unit: item.Description || "",
              learningOutcomes: "",
              readingAssignments: "",
            }))
            .map((row) => withParsedDateMetadata(row, normalizedYear));

        setScheduleRows((currentRows) => {
          const mergedRows = [...currentRows, ...generatedSchedule];
          const deduplicatedRows = deduplicateRows(mergedRows);
          return sortRowsByDate(deduplicatedRows, normalizedYear);
        });

        triggerInput();
      }
    } catch (error) {
      console.error("Error generating schedule", error);

      let apiMessage = "";

      try {
        if (error.response) {
          const body = await error.response.json();
          apiMessage = body?.error || "";
        }
      } catch {
        apiMessage = "";
      }

      alert(
          apiMessage
              ? `Schedule can’t be generated: ${apiMessage}`
              : "Schedule can’t be generated. Please check your term, year, and days, or try again later."
      );
    }
  };

  // Render

  const missingScheduleInfo = function(term, year, days) {
    const values = [term, year, days].map(coerceToTrimmedString);
    if (values.some((x) => x === "")) {
      return true;
    }
    return false;
  }


  return (

    <div> 
      <div style = {{margin: "1%"}}>
        {(missingScheduleInfo(normalizedTerm, normalizedYear, normalizedDays))? (
          <p style = {{color: "darkred", fontWeight: "bold"}}>
            Note: for the option to autogenerate your schedule, enter a term, year, and days on the Basic Information page</p>
        ): 
        <div style = {{display: "flex"}}>
          <button class = 'reusable-button primary' 
            onClick={generateSchedule}>Generate Schedule ({normalizedTerm} {normalizedYear}, {normalizedDays})
          </button>&nbsp;
          <button class = 'reusable-button primary' onClick={clearSchedule}>Clear Schedule</button>
          </div>          
        }
      </div> 

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginRight: "2%", alignItems: "center" }}>
        <label>Date format:&nbsp;
          <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            <option value="mm/dd">mm/dd</option>
            <option value="mm/dd/yyyy">mm/dd/yyyy</option>
            <option value="mm/dd/yy">mm/dd/yy</option>
          </select>
        </label>
        &nbsp;
        <button class='reusable-button primary' onClick={sortScheduleByDate} disabled={datesSorted}>Sort by date</button>
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
              <div>
                <textarea
                  maxLength = {30}                                                  
                  value={row.date}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index] = {
                      ...updatedRows[index],
                      date: e.target.value,
                      dateTimestamp: Number.POSITIVE_INFINITY,
                      sortableDateTimestamp: parseSortableRowDateValue(e.target.value, normalizedYear),
                    };
                    setScheduleRows(updatedRows);
                  }}
                onBlur={(e) => {
                    const ts = parseStandaloneDateValue(e.target.value, normalizedYear);
                    if (ts !== Number.POSITIVE_INFINITY) {
                      const updatedRows = [...scheduleRows];
                      updatedRows[index] = {
                        ...updatedRows[index],
                        date: formatDate(ts, dateFormat),
                        dateTimestamp: ts,
                        sortableDateTimestamp: ts,
                      };
                      setScheduleRows(updatedRows);
                    } else {
                      const updatedRows = [...scheduleRows];
                      updatedRows[index] = {
                        ...updatedRows[index],
                        date: e.target.value,
                        dateTimestamp: Number.POSITIVE_INFINITY,
                        sortableDateTimestamp: parseSortableRowDateValue(e.target.value, normalizedYear),
                      };
                      setScheduleRows(updatedRows);
                    }
                  }}
                />
                </div>
              </td>
              <td>
                <textarea
                  value={row.day}
                  maxLength = {30}
                  onChange={(e) => {
                    const updatedRows = [...scheduleRows];
                    updatedRows[index].day = e.target.value;
                    setScheduleRows(updatedRows);
                  }}
                />
              </td>
              <td>
                <textarea
                maxLength = {200}
                style = {{
                    overflowY: 'auto',
                    resize:    'vertical',    
                    minHeight: '4em',
                    width: '100%'                  
                  }}
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
                 maxLength = {200}
                 style = {{
                    overflowY: 'auto',
                    resize:    'vertical',    
                    minHeight: '4em',
                    width: '100%'                  
                  }}
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
                 maxLength = {200}
                  style = {{
                    overflowY: 'auto',
                    resize:    'vertical',    
                    minHeight: '4em',
                    width: '100%'                
                  }}
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

