import * as XLSX from "xlsx-js-style"

import {
    Course_Schedule_Excel_Cols,
    Course_Schedule_Sheet_Identifier,
} from "./constants";
import type { CourseScheduleRow } from "../types/courseScheduleTypes";

import {schedRowsToExcelRows} from "./mappers";
import {sizeOfWorksheet} from "./excelFormat";

export const downloadScheduleTemplate = (
    rows: CourseScheduleRow[],
    fileName = "course-schedule-template.xlsx"
): void => {
    const templateRows = schedRowsToExcelRows(rows);

    const worksheet = XLSX.utils.json_to_sheet(templateRows, {
        header: [...Course_Schedule_Excel_Cols],
    });

    sizeOfWorksheet(worksheet, templateRows.length);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        Course_Schedule_Sheet_Identifier
    );

    XLSX.writeFile(workbook, fileName);
};