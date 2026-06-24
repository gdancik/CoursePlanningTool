import type { CourseScheduleRow } from "./courseScheduleTypes";
import { parseSortableRowDateValue } from "./dateUtils";

const getSortableTimestamp = (
    row: CourseScheduleRow,
    courseYear: number
): number => {
    if (Number.isFinite(row.sortableDateTimestamp)) {
        return row.sortableDateTimestamp;
    }

    return parseSortableRowDateValue(row.date, courseYear);
};

const toDeduplicationKey = (row: CourseScheduleRow): string =>
    [
        row.date,
        row.day,
        row.unit,
        row.learningOutcomes,
        row.readingAssignments,
    ]
        .map((value) => value.trim().toLowerCase())
        .join("|");

export const deduplicateRows = (
    rows: CourseScheduleRow[]
): CourseScheduleRow[] => {
    const seenKeys = new Set<string>();

    return rows.filter((row) => {
        const key = toDeduplicationKey(row);

        if (seenKeys.has(key)) {
            return false;
        }

        seenKeys.add(key);
        return true;
    });
};

export const sortRowsByDate = (
    rows: CourseScheduleRow[],
    courseYear: number
): CourseScheduleRow[] =>
    rows
        .map((row, index) => ({ row, index }))
        .sort((a, b) => {
            const dateA = getSortableTimestamp(a.row, courseYear);
            const dateB = getSortableTimestamp(b.row, courseYear);

            if (dateA !== dateB) {
                return dateA - dateB;
            }

            return a.index - b.index;
        })
        .map((entry) => entry.row);

export const areRowsSortedByDate = (
    rows: CourseScheduleRow[],
    courseYear: number
): boolean =>
    rows.every((row, index) => {
        if (index === 0) {
            return true;
        }

        const previousTimestamp = getSortableTimestamp(rows[index - 1], courseYear);
        const currentTimestamp = getSortableTimestamp(row, courseYear);

        return previousTimestamp <= currentTimestamp;
    });

export const hasScheduleContent = (rows: CourseScheduleRow[]): boolean =>
    rows.some((row) =>
        [
            row.date,
            row.day,
            row.unit,
            row.learningOutcomes,
            row.readingAssignments,
        ].some((value) => value.trim() !== "")
    );

export const mergeGeneratedRows = (
    currentRows: CourseScheduleRow[],
    generatedRows: CourseScheduleRow[],
    courseYear: number
): CourseScheduleRow[] => {
    const mergedRows = [...currentRows, ...generatedRows];
    const deduplicatedRows = deduplicateRows(mergedRows);

    return sortRowsByDate(deduplicatedRows, courseYear);
};