import {NormalizedYear, DateFormat, CourseScheduleRow} from "../types/courseScheduleTypes";
import {coerceToTrimmedString} from "./normalizers";
export const INVALID_DATE_TIMESTMP = Number.POSITIVE_INFINITY;


type DateParser = {
    name: string;
    pattern: RegExp;
    parse: (match: RegExpMatchArray, courseYear: NormalizedYear) => number;
};

const normalizeTwoDigitYear = (year: number): number => {
    return year <100 ? 2000 + year: year;
}

const createTimeStamp = (
    year: number,
    month: number,
    day: number
): number => {
    if (month < 1 || month > 12 ){
        return INVALID_DATE_TIMESTMP;
    }
    if (day < 1 || day > 31) {
        return INVALID_DATE_TIMESTMP;
    }
    const date = new Date(year, month - 1, day);

    const isValidDate =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

    return isValidDate ? date.getTime() : INVALID_DATE_TIMESTMP;
};

const parseNumericDate = (value: string, courseYear: number): number => {
    const match = value.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);

    if (!match) {
        return INVALID_DATE_TIMESTMP;
    }

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = match[3]
        ? normalizeTwoDigitYear(Number(match[3]))
        : courseYear;

    return createTimeStamp(year, month, day);
};

const parseMonthNameDate = (value: string, courseYear: number): number => {
    const match = value.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:,\s*(\d{2,4}))?$/);

    if (!match) {
        return INVALID_DATE_TIMESTMP;
    }

    const parsedMonth = Date.parse(`${match[1]} 1, 2000`);

    if (Number.isNaN(parsedMonth)) {
        return INVALID_DATE_TIMESTMP;
    }

    const month = new Date(parsedMonth).getMonth() + 1;
    const day = Number(match[2]);
    const year = match[3]
        ? normalizeTwoDigitYear(Number(match[3]))
        : courseYear;

    return createTimeStamp(year, month, day);
};

export const parseStandaloneDateValue = (
    dateValue: unknown,
    courseYear: number
): number => {
    const value = coerceToTrimmedString(dateValue);

    if (!value) {
        return INVALID_DATE_TIMESTMP;
    }

    const numericDate = parseNumericDate(value, courseYear);

    if (numericDate !== INVALID_DATE_TIMESTMP) {
        return numericDate;
    }

    const monthNameDate = parseMonthNameDate(value, courseYear);

    if (monthNameDate !== INVALID_DATE_TIMESTMP) {
        return monthNameDate;
    }

    const parsedDate = Date.parse(value);

    return  INVALID_DATE_TIMESTMP;
};

const extractLeadingDateText = (value: string): string | null => {
    const match = value.match(
        /^([A-Za-z]{3,9}\s+\d{1,2}(?:,\s*\d{2,4})?|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)/
    );

    return match ? match[1] : null;
};

export const parseSortableRowDateValue = (
    dateValue: unknown,
    courseYear: number
): number => {
    const value = coerceToTrimmedString(dateValue);

    if (!value) {
        return INVALID_DATE_TIMESTMP;
    }

    const leadingDateText = extractLeadingDateText(value);

    return parseStandaloneDateValue(leadingDateText ?? value, courseYear);
};

export const formatDate = (
    timestamp: number,
    format: DateFormat
): string => {
    if (timestamp === INVALID_DATE_TIMESTMP) {
        return "";
    }

    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (format === "mm/dd") {
        return `${month}/${day}`;
    }

    if (format === "mm/dd/yy") {
        return `${month}/${day}/${String(date.getFullYear()).slice(-2)}`;
    }

    return `${month}/${day}/${date.getFullYear()}`;
};

export const withParsedDateMetadata = (
    row: Omit<CourseScheduleRow, "dateTimestamp" | "sortableDateTimestamp"> &
        Partial<Pick<CourseScheduleRow, "dateTimestamp" | "sortableDateTimestamp">>,
    courseYear: number
): CourseScheduleRow => {
    const dateTimestamp = parseStandaloneDateValue(row.date, courseYear);
    const sortableDateTimestamp = parseSortableRowDateValue(row.date, courseYear);

    return {
        ...row,
        dateTimestamp,
        sortableDateTimestamp,
    };
};
const splitDateRange = (value: string): string[] => {
    return value
        .split(/\s+-\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
};

export const validateScheduleDateValue = (
    dateValue: unknown,
    courseYear: number
): void => {
    const value = coerceToTrimmedString(dateValue);

    if (!value) {
        return;
    }

    const dateParts = splitDateRange(value);

    if (dateParts.length === 2) {
        dateParts.forEach((datePart) => {
            const timestamp = parseStandaloneDateValue(datePart, courseYear);

            if (timestamp === INVALID_DATE_TIMESTMP) {
                throw new Error(
                    `Invalid date "${value}". Date ranges must use MM/DD/YYYY - MM/DD/YYYY format.`
                );
            }
        });

        return;
    }

    const timestamp = parseStandaloneDateValue(value, courseYear);

    if (timestamp === INVALID_DATE_TIMESTMP) {
        throw new Error(
            `Invalid date "${value}". Dates must be valid and use MM/DD, MM/DD/YYYY, Month Day, or MM/DD/YYYY - MM/DD/YYYY format.`
        );
    }
};