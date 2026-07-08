import * as XLSX from "xlsx-js-style"

import {
    Course_Schedule_Excel_Cols,
    Course_Schedule_Sheet_Identifier,
} from "./constants";

import type { ExcelSchedRow} from "./mappers";

export const downloadScheduleTemplate = (
    fileName = "course-schedule-template.xlsx"
): void => {
    const templateRows: ExcelSchedRow[] = [
        {
            Date: "01/21/2026",
            Day: "Wednesday",
            "Unit and Theme/Topic": "Example topic",
            "Learning Outcomes Addressed": "LO1",
            "Reading/Assignments Due": "Example reading due",
        },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows, {
        header: [...Course_Schedule_Excel_Cols],
    });

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        Course_Schedule_Sheet_Identifier
    );

    XLSX.writeFile(workbook, fileName);
};