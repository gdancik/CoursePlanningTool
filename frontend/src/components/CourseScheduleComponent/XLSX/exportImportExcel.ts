import * as XLSX from "xlsx-js-style"
import {Course_Schedule_Excel_Cols, Course_Schedule_Sheet_Identifier} from "./constants";
import type {CourseScheduleRow} from "../types/courseScheduleTypes";
import {sizeOfWorksheet} from "./excelFormat";
import {schedRowsToExcelRows, excelRowsToSchedRows, type ExcelSchedRow} from "./mappers";

/**
 * VALIDATION FOR EXCEL
 */

export const validateScheduleCols = (columns: string[]): void => {

    const missingCols = Course_Schedule_Excel_Cols.filter((column) => !columns.includes(column));

    if (missingCols.length > 0) {
        throw new Error (`Invalid schedule spreadsheet. Missing columns: ${missingCols.join(", ")}.`)
    }
}

/**
 * EXPORT SCHEDULE
 */

export const exportRowsToExcel = (
    rows: CourseScheduleRow[],
    fileName = "course-schedule.xlsx"
): void =>
{
    const excelRows = schedRowsToExcelRows(rows);

    const wrkSheet = XLSX.utils.json_to_sheet(excelRows, { header: [...Course_Schedule_Excel_Cols],});

    sizeOfWorksheet(wrkSheet, excelRows.length)

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        wrkSheet,
        Course_Schedule_Sheet_Identifier
    );

    XLSX.writeFile(workbook, fileName);
};

/**
 * Import Schedule
 */

export const importExcelFile = async (
    file: File,
    courseYear: number
): Promise<CourseScheduleRow[]> => {
    const buffer = await file.arrayBuffer();

    const workbook =  XLSX.read(buffer, {type: "array",  cellDates: false,});

    const firstSheetName = workbook.SheetNames[0]

    if (!firstSheetName) {
        throw new Error("The Excel file does not contain any sheets.");
    }

    const wrkSheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        wrkSheet,
        {
            defval: "",
            raw: true,
        }
    )
    const columns = rawRows[0] ? Object.keys(rawRows[0]) : [];
    validateScheduleCols(columns);

    return excelRowsToSchedRows(rawRows as ExcelSchedRow[], courseYear);

}




