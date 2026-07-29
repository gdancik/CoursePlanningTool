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

const isLeapYear = (year: number): boolean =>
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const getDaysInMonth = (month: number, year: number): number => {
    const daysByMonth: Record<number, number> = {
        1: 31,
        2: isLeapYear(year) ? 29 : 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };

    return daysByMonth[month] ?? 0;
};

const validateMonthDayYear = (
    month: number,
    day: number,
    year: number,
    originalValue: string
): void => {
    if (month < 1 || month > 12) {
        throw new Error(
            `Invalid date "${originalValue}". Month must be between 1 and 12.`
        );
    }

    const daysInMonth = getDaysInMonth(month, year);

    if (day < 1 || day > daysInMonth) {
        throw new Error(
            `Invalid date "${originalValue}". Month ${month} in ${year} only has ${daysInMonth} days.`
        );
    }
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

const normalizeSingleExcelDateString = (value: string): string => {
    const trimmed = value.trim();

    const slashDateMatch = trimmed.match(
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/
    );

    if (!slashDateMatch) {
        throw new Error(
            `Invalid date "${trimmed}". Dates must use MM/DD/YYYY format.`
        );
    }

    const month = Number(slashDateMatch[1]);
    const day = Number(slashDateMatch[2]);
    const rawYear = Number(slashDateMatch[3]);

    const year = rawYear < 100 ? 2000 + rawYear : rawYear;

    validateMonthDayYear(month, day, year, trimmed);

    return formatMonthDayYear(month, day, year);
};

const normalizeExcelDateString = (value: string): string => {
    const trimmed = value.trim();

    if (trimmed === "") {
        return "";
    }

    const dateRangeParts = trimmed
        .split(/\s+-\s+/)
        .map((part) => part.trim());

    if (dateRangeParts.length === 2) {
        const startDate = normalizeSingleExcelDateString(dateRangeParts[0]);
        const endDate = normalizeSingleExcelDateString(dateRangeParts[1]);

        return `${startDate} - ${endDate}`;
    }

    return normalizeSingleExcelDateString(trimmed);
};


export const normalizeExcelDateCell = (value: unknown): string => {
    if (value === null || value === undefined) {
        return "";
    }

    if (isLikelyExcelSerialDate(value)) {
        return formatExcelSerialDate(Number(value));
    }

    return normalizeExcelDateString(normalizeExcelCells(value));
};
