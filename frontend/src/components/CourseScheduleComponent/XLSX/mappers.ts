import type { CourseScheduleColumn, CourseScheduleRow } from "../types/courseScheduleTypes";
import { createEmptyScheduleRow } from "../utilities/factories";
import { withParsedDateMetadata } from "../utilities/dateUtils";
import { Course_Schedule_Excel_Cols } from "./constants";


export type ExcelSchedRow = Record<CourseScheduleColumn, string>;

export const normalizeExcelCells = (value: unknown): string => {
    if (value === null || value === undefined) {
        return "";
    }
    return String(value).trim();
}

export const ExcelRowHasData = (row: ExcelSchedRow): boolean => Course_Schedule_Excel_Cols.some ((column) => normalizeExcelCells(row[column]) !== "");

export const schedRowsToExcelRows = (rows: CourseScheduleRow[]) : ExcelSchedRow[] => rows.map((row) => ({
    Date: row.date,
    Day: row.day,
    "Unit and Theme/Topic": row.unit,
    "Learning Outcomes Addressed": row.learningOutcomes,
    "Reading/Assignments Due": row.readingAssignments
}));

export const excelRowsToSchedRows = (
    rows: ExcelSchedRow[],
    courseYear: number
): CourseScheduleRow[] => {
    const schedRows = rows.filter(ExcelRowHasData).map((row) => 
    {
        const schedRow =  { 
            ...createEmptyScheduleRow(), 
            date: normalizeExcelCells(row["Date"]),
            day: normalizeExcelCells(row["Day"]),
            unit: normalizeExcelCells(row["Unit and Theme/Topic"]),
            LearningOutcome: normalizeExcelCells(row["Learning Outcomes Addressed"]),
            readingAssignments: normalizeExcelCells(row["Reading/Assignments Due"]),
        };
        return withParsedDateMetadata(schedRow, courseYear);

    });
    return schedRows.length > 0 ? schedRows : [createEmptyScheduleRow()]
}


