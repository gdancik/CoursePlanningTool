import {createEmptyScheduleRow} from "./factories";
import {CourseScheduleRow} from "./courseScheduleTypes";

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