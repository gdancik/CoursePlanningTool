import type { CourseScheduleRow } from "./courseScheduleTypes";
import { createEmptyScheduleRow } from "./factories";
import { withParsedDateMetadata } from "./dateUtils";

type BackendScheduleCell = string | number | null | undefined;
type BackendScheduleRow = BackendScheduleCell[];

type GeneratedScheduleItem = {
    Date?: string;
    Day?: string;
    Description?: string;
};

const coerceCellToString = (value: BackendScheduleCell): string => {
    if (value === undefined || value === null) {
        return "";
    }

    return String(value);
};

export const backendArrayRowToScheduleRow = (
    row: BackendScheduleRow,
    courseYear: number
): CourseScheduleRow => {
    const scheduleRow = {
        ...createEmptyScheduleRow(),
        date: coerceCellToString(row[0]),
        day: coerceCellToString(row[1]),
        unit: coerceCellToString(row[2]),
        learningOutcomes: coerceCellToString(row[3]),
        readingAssignments: coerceCellToString(row[4]),
    };

    return withParsedDateMetadata(scheduleRow, courseYear);
};

export const backendScheduleToRows = (
    data: unknown,
    courseYear: number
): CourseScheduleRow[] => {
    if (data === undefined || data === null || data === "") {
        return [createEmptyScheduleRow()];
    }

    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;

        if (!Array.isArray(parsed)) {
            return [createEmptyScheduleRow()];
        }

        const [, ...bodyRows] = parsed;

        const rows = bodyRows
            .filter((row): row is BackendScheduleRow => Array.isArray(row))
            .map((row) => backendArrayRowToScheduleRow(row, courseYear));

        return rows.length > 0 ? rows : [createEmptyScheduleRow()];
    } catch {
        return [createEmptyScheduleRow()];
    }
};

export const generatedScheduleItemsToRows = (
    generatedItems: GeneratedScheduleItem[],
    courseYear: number
): CourseScheduleRow[] =>
    generatedItems.map((item) => {
        const scheduleRow = {
            ...createEmptyScheduleRow(),
            date: item.Date ?? "",
            day: item.Day ?? "",
            unit: item.Description ?? "",
            learningOutcomes: "",
            readingAssignments: "",
        };

        return withParsedDateMetadata(scheduleRow, courseYear);
    });