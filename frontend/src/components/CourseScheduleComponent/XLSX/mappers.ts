import type { CourseScheduleColumn, CourseScheduleRow } from "../types/courseScheduleTypes";
import { createEmptyScheduleRow } from "../utilities/factories";
import { withParsedDateMetadata } from "../utilities/dateUtils";
import { Course_Schedule_Excel_Cols } from "./constants";


export type ExcelSchedRow = Record<CourseScheduleColumn, unknown>;

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
        const schedRow = {
            ...createEmptyScheduleRow(),
            date: normalizeExcelDateCell(row["Date"]),
            day: normalizeExcelCells(row["Day"]),
            unit: normalizeExcelCells(row["Unit and Theme/Topic"]),
            learningOutcomes: normalizeExcelCells(
                row["Learning Outcomes Addressed"]
            ),
            readingAssignments: normalizeExcelCells(
                row["Reading/Assignments Due"]
            ),
        };
        return withParsedDateMetadata(schedRow, courseYear);

    });
    return schedRows.length > 0 ? schedRows : [createEmptyScheduleRow()]
}


const formatMonthDayYear = (
    month: number,
    day: number,
    year: number
): string => {
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    return `${formattedMonth}/${formattedDay}/${year}`;
};

const formatExcelSerialDate = (serialDate: number): string => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    const date = new Date(
        excelEpoch.getTime() + serialDate * millisecondsPerDay
    );

    return formatMonthDayYear(
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCFullYear()
    );
};

const isLikelyExcelSerialDate = (value: unknown): boolean => {
    const numericValue = Number(value);

    return (
        Number.isFinite(numericValue) &&
        numericValue > 20000 &&
        numericValue < 80000
    );
};

export const normalizeExcelDateCell = (value: unknown): string => {
    if (value === null || value === undefined) {
        return "";
    }

    if (isLikelyExcelSerialDate(value)) {
        return formatExcelSerialDate(Number(value));
    }

    return normalizeExcelCells(value);
};