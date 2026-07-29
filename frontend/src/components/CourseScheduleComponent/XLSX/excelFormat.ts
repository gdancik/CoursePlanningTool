import * as XLSX from "xlsx-js-style";

const DATE_COLUMN_INDEX = 0;
const LAST_COLUMN_INDEX = 4;
const TEMPLATE_ROW_COUNT = 300;

const COURSE_SCHEDULE_COLUMN_WIDTHS = [
    { wch: 30 }, // Date
    { wch: 25 }, // Day
    { wch: 50 }, // Unit and Theme/Topic
    { wch: 30 }, // Learning Outcomes Addressed
    { wch: 40 }, // Reading/Assignments Due
];

const DEFAULT_EXCEL_ROW_HEIGHT = 36;

export const sizeOfWorksheet = (
    worksheet: XLSX.WorkSheet,
    rowCount: number
): void => {
    const totalRows = Math.max(rowCount + 1, TEMPLATE_ROW_COUNT);

    worksheet["!cols"] = COURSE_SCHEDULE_COLUMN_WIDTHS;

    worksheet["!rows"] = Array.from({ length: rowCount + 1 }, (_value, index) => ({
        hpt: index === 0 ? 28 : DEFAULT_EXCEL_ROW_HEIGHT,
    }));


    worksheet["!ref"] = XLSX.utils.encode_range({
        s: { r: 0, c: 0,},
        e: { r: totalRows - 1, c: LAST_COLUMN_INDEX,},
    });

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex += 1) {
        const dateCellAddress = XLSX.utils.encode_cell({
            r: rowIndex,
            c: DATE_COLUMN_INDEX,
        });

        if (!worksheet[dateCellAddress]) {
            worksheet[dateCellAddress] = { t: "s", v: "",};
        }

        worksheet[dateCellAddress].t = "s";
        worksheet[dateCellAddress].v = String(worksheet[dateCellAddress].v ?? "");
        worksheet[dateCellAddress].z = "@";
        worksheet[dateCellAddress].s = {numFmt: "@",};
    }
};