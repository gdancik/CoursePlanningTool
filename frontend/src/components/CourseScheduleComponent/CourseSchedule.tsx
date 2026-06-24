import React, { useEffect, useState } from "react";
import "../SyllabusComponents/Tables/gradeTable.css";
import "../Button/ReusableButton.css";

import { triggerInput} from "../../services/triggerInput";
import apiClient from "../../services/apiClient";
import config from "../../configs/courseConfig.json"

import { createEmptyScheduleRow } from "./factories";
import type {
  CourseScheduleProps,
  CourseScheduleRow,
  DateFormat,
} from "./courseScheduleTypes";

import {
  coerceToTrimmedString,
  normalizeDays,
  normalizeTerm,
  normalizeYearString,
    normalizeCourseYear
} from "./normalizers";


import {
  INVALID_DATE_TIMESTMP,
  formatDate,
  parseSortableRowDateValue,
  parseStandaloneDateValue,
} from "./dateUtils";

import {
  areRowsSortedByDate,
  mergeGeneratedRows,
  sortRowsByDate,
} from "./rowUtils";

import {
  backendScheduleToRows,
  generatedScheduleItemsToRows,
} from "./mapper";

type GenerateScheduleResponse = {
  error?: string;
  schedule?: Array<{
    Date?: string;
    Day?: string;
    Description?: string;
  }>;
};

function CourseSchedule({
                          id,
                          term,
                          year,
                          days,
                          data,
                        }: CourseScheduleProps) {
    const normalizedTerm = normalizeTerm(term);
    const normalizedYear = normalizeYearString(year);
    const courseYear = normalizeCourseYear(year);
    const dateParsingYear = courseYear ?? new Date().getFullYear();
    const normalizedDays = normalizeDays(days);

  const [scheduleRows, setScheduleRows] = useState<CourseScheduleRow[]>([
    createEmptyScheduleRow(),
  ]);

  const [dateFormat, setDateFormat] =
      useState<DateFormat>("mm/dd/yyyy");

  const missingScheduleInformation = missingScheduleInfo(
      normalizedTerm,
      normalizedYear,
      normalizedDays
  );

  const datesSorted = areRowsSortedByDate(scheduleRows, dateParsingYear);

  useEffect(() => {
    setScheduleRows(backendScheduleToRows(data, dateParsingYear));
  }, [data, normalizedYear]);

  useEffect(() => {
    setScheduleRows((currentRows) =>
        currentRows.map((row) => {
          const timestamp = Number.isFinite(row.dateTimestamp)
              ? row.dateTimestamp
              : parseStandaloneDateValue(row.date, dateParsingYear);

          if (timestamp === INVALID_DATE_TIMESTMP) {
            return row;
          }

          return {
            ...row,
            date: formatDate(timestamp, dateFormat),
            dateTimestamp: timestamp,
          };
        })
    );

    triggerInput();
  }, [dateFormat, normalizedYear]);

  const addRow = (index: number): void => {
    const newRow = createEmptyScheduleRow();

    const updatedRows = [
      ...scheduleRows.slice(0, index + 1),
      newRow,
      ...scheduleRows.slice(index + 1),
    ];

    setScheduleRows(updatedRows);
    triggerInput();
  };

  const deleteRow = (index: number): void => {
    if (scheduleRows.length <= 1) {
      return;
    }

    const updatedRows = scheduleRows.filter(
        (_row, rowIndex) => rowIndex !== index
    );

    setScheduleRows(updatedRows);
    triggerInput();
  };

  const clearSchedule = (): void => {
    const clearedRows =
        scheduleRows.length > 0
            ? scheduleRows.map(() => createEmptyScheduleRow())
            : [createEmptyScheduleRow()];

    setScheduleRows(clearedRows);
    triggerInput();
  };

  const sortScheduleByDate = (): void => {
    setScheduleRows((currentRows) =>
        sortRowsByDate(currentRows, dateParsingYear)
    );

    triggerInput();
  };

  const updateRowField = <K extends keyof CourseScheduleRow>(
      index: number,
      field: K,
      value: CourseScheduleRow[K]
  ): void => {
    setScheduleRows((currentRows) =>
        currentRows.map((row, rowIndex) =>
            rowIndex === index
                ? {
                  ...row,
                  [field]: value,
                }
                : row
        )
    );
  };

  const updateDateField = (index: number, value: string): void => {
    setScheduleRows((currentRows) =>
        currentRows.map((row, rowIndex) =>
            rowIndex === index
                ? {
                  ...row,
                  date: value,
                  dateTimestamp: INVALID_DATE_TIMESTMP,
                  sortableDateTimestamp: parseSortableRowDateValue(
                      value,
                      dateParsingYear
                  ),
                }
                : row
        )
    );
  };

  const normalizeDateField = (index: number, value: string): void => {
    const timestamp = parseStandaloneDateValue(value, dateParsingYear);

    setScheduleRows((currentRows) =>
        currentRows.map((row, rowIndex) => {
          if (rowIndex !== index) {
            return row;
          }

          if (timestamp !== INVALID_DATE_TIMESTMP) {
            return {
              ...row,
              date: formatDate(timestamp, dateFormat),
              dateTimestamp: timestamp,
              sortableDateTimestamp: timestamp,
            };
          }

          return {
            ...row,
            date: value,
            dateTimestamp: INVALID_DATE_TIMESTMP,
            sortableDateTimestamp: parseSortableRowDateValue(
                value,
                dateParsingYear
            ),
          };
        })
    );
  };

  const generateSchedule = async (): Promise<void> => {
    try {
      if (missingScheduleInformation) {
        alert(
            "Please provide valid term, year, and days before generating a schedule."
        );
        return;
      }

      const scheduleData = await apiClient
          .post("generateSchedule/", {
            json: {
              term: normalizedTerm,
              year: normalizedYear,
              days: normalizedDays,
            },
          })
          .json<GenerateScheduleResponse>();

      if (config.log) {
        console.log("API response:", scheduleData);
      }

      if (scheduleData.error) {
        alert(`Schedule can’t be generated: ${scheduleData.error}`);
        return;
      }

      if (Array.isArray(scheduleData.schedule)) {
        const generatedSchedule = generatedScheduleItemsToRows(
            scheduleData.schedule,
            dateParsingYear
        );

        setScheduleRows((currentRows) =>
            mergeGeneratedRows(
                currentRows,
                generatedSchedule,
                dateParsingYear
            )
        );

        triggerInput();
      }
    } catch (error: unknown) {
      console.error("Error generating schedule", error);

      let apiMessage = "";

      try {
        const maybeKyError = error as {
          response?: {
            json: () => Promise<{ error?: string }>;
          };
        };

        if (maybeKyError.response) {
          const body = await maybeKyError.response.json();
          apiMessage = body?.error ?? "";
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

  return (
      <div>
        <div style={{ margin: "1%" }}>
          {missingScheduleInformation ? (
              <p style={{ color: "darkred", fontWeight: "bold" }}>
                Note: for the option to autogenerate your schedule, enter a term,
                year, and days on the Basic Information page
              </p>
          ) : (
              <div style={{ display: "flex" }}>
                <button
                    className="reusable-button primary"
                    onClick={generateSchedule}
                >
                  Generate Schedule ({normalizedTerm} {normalizedYear},{" "}
                  {normalizedDays})
                </button>
                &nbsp;
                <button
                    className="reusable-button primary"
                    onClick={clearSchedule}
                >
                  Clear Schedule
                </button>
              </div>
          )}
        </div>

        <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginRight: "2%",
              alignItems: "center",
            }}
        >
          <label>
            Date format:&nbsp;
            <select
                value={dateFormat}
                onChange={(event) =>
                    setDateFormat(event.target.value as DateFormat)
                }
            >
              <option value="mm/dd">mm/dd</option>
              <option value="mm/dd/yyyy">mm/dd/yyyy</option>
              <option value="mm/dd/yy">mm/dd/yy</option>
            </select>
          </label>
          &nbsp;
          <button
              className="reusable-button primary"
              onClick={sortScheduleByDate}
              disabled={datesSorted}
          >
            Sort by date
          </button>
        </div>

        <table id={id} style={{ margin: "2%" }}>
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
              <tr key={row.id}>
                <td>
                  <div>
                  <textarea
                      maxLength={30}
                      value={row.date}
                      onChange={(event) =>
                          updateDateField(index, event.target.value)
                      }
                      onBlur={(event) =>
                          normalizeDateField(index, event.target.value)
                      }
                  />
                  </div>
                </td>

                <td>
                <textarea
                    value={row.day}
                    maxLength={30}
                    onChange={(event) =>
                        updateRowField(index, "day", event.target.value)
                    }
                />
                </td>

                <td>
                <textarea
                    maxLength={200}
                    style={{
                      overflowY: "auto",
                      resize: "vertical",
                      minHeight: "4em",
                      width: "100%",
                    }}
                    value={row.unit}
                    onChange={(event) =>
                        updateRowField(index, "unit", event.target.value)
                    }
                />
                </td>

                <td>
                <textarea
                    maxLength={200}
                    style={{
                      overflowY: "auto",
                      resize: "vertical",
                      minHeight: "4em",
                      width: "100%",
                    }}
                    value={row.learningOutcomes}
                    onChange={(event) =>
                        updateRowField(
                            index,
                            "learningOutcomes",
                            event.target.value
                        )
                    }
                />
                </td>

                <td>
                <textarea
                    maxLength={200}
                    style={{
                      overflowY: "auto",
                      resize: "vertical",
                      minHeight: "4em",
                      width: "100%",
                    }}
                    value={row.readingAssignments}
                    onChange={(event) =>
                        updateRowField(
                            index,
                            "readingAssignments",
                            event.target.value
                        )
                    }
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

const missingScheduleInfo = (
    term: unknown,
    year: unknown,
    days: unknown
): boolean => {
  const values = [term, year, days].map(coerceToTrimmedString);

  return values.some((value) => value === "");
};

export default CourseSchedule;