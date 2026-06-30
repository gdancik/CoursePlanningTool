import {createEmptyScheduleRow} from "../factories";
import {CourseScheduleRow, DateFormat, DayDisplayOption} from "../../types/courseScheduleTypes";
import {formatDate, INVALID_DATE_TIMESTMP, parseSortableRowDateValue, parseStandaloneDateValue} from "../dateUtils";
import {sortRowsByDate} from "../rowUtils";
import {formatDayCodes, formatDayValue} from "../normalizers";

export const insertEmptyRowAtIndex = (
    rows: CourseScheduleRow[],
    index: number
): CourseScheduleRow[] => [
    ...rows.slice(0, index + 1),
        createEmptyScheduleRow(),
        ...rows.slice(index + 1),
    ]

export const deleteRowAtIndex = (
    rows: CourseScheduleRow[],
    index: number
): CourseScheduleRow[] => {
    if (rows.length <= 1){
        return rows;
    }
    return rows.filter((_row, rowIndex) => rowIndex !== index);
}

export const clearScheduleRows = (
    rows: CourseScheduleRow[],
): CourseScheduleRow[] => {
    if(rows.length === 0) {
        return [createEmptyScheduleRow()];
    }
    return rows.map(() => createEmptyScheduleRow());
};

export const updateRowAtIndex  = <K extends keyof CourseScheduleRow> (
    rows: CourseScheduleRow[],
    index: number,
    field: K,
    value: CourseScheduleRow[K]
): CourseScheduleRow[] =>
    rows.map((row, rowIndex) =>
            rowIndex === index
                ? {
                    ...row,
                    [field]: value,
                }
                : row
    );

export const updateDateFieldAtIndex = (rows: CourseScheduleRow[], index: number, value: string, courseYear: number):CourseScheduleRow[] =>
    rows.map((row, rowIndex) =>
    rowIndex === index
        ? {...row,
            date:value,
            dateTimestamp: INVALID_DATE_TIMESTMP,
            sortableDateTimestamp: parseSortableRowDateValue(value, courseYear),
    }
    : row
);
export const normalizeDateFieldAtIndex = (rows: CourseScheduleRow[], index: number, value: string, courseYear: number, dateFormat: DateFormat): CourseScheduleRow[] => {
    const timestamp = parseStandaloneDateValue(value, courseYear);

    return rows.map((row, rowIndex) => {
        if (rowIndex !== index) {
            return row;
        }
        if (timestamp !== INVALID_DATE_TIMESTMP) {
            return {
                ...row,
                date: formatDate(timestamp, dateFormat),
                dateTimestamp: timestamp,
                sortableDateTimestamp: timestamp
            }
        }
        return {
            ...row,
            date: value,
            dateTimestamp: INVALID_DATE_TIMESTMP,
            sortableDateTimestamp: parseSortableRowDateValue(value, courseYear),
        };
    });
};

export const sortScheduleRowsByDate = (
    rows: CourseScheduleRow[],
    courseYear: number
): CourseScheduleRow[] => sortRowsByDate(rows, courseYear);

export const formatScheduleRowsByDate = (
    rows: CourseScheduleRow[],
    courseYear: number,
    dateFormat: DateFormat
): CourseScheduleRow[] =>
    rows.map((row) =>
    {
        const timestamp = parseStandaloneDateValue(row.date, courseYear);
        if(timestamp === INVALID_DATE_TIMESTMP) {
            return {
                ...row, sortableDateTimestamp:parseSortableRowDateValue(row.date,courseYear),
            };
        }
        return {
            ...row,
            date: formatDate(timestamp, dateFormat),
            dateTimestamp:timestamp,
            sortableDateTimestamp: timestamp,
        }
    })

export const formatScheduleRowsByDayDisplay = (
    rows: CourseScheduleRow[],
    dayDisplayOption: DayDisplayOption
): CourseScheduleRow[] =>
    rows.map((row) => ({
        ...row,
        day: formatDayValue(row.day, dayDisplayOption),
    }));