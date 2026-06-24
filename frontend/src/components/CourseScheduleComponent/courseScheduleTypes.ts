/**
 * COURSE
 */

export type DateFormat = "mm/dd" | "mm/dd/yyyy" | "mm/dd/yy";

export type DayCode = "M" | "T" | "W" | "R" | "F" | "S" | "U";

export type ThursdayDisplayOption = "R" | "Th";

export type DayDisplayFormat = "codes" | "shortNames" | "longNames";

export type DayDisplayOption = {
    format: DayDisplayFormat;
    thursdayOption: ThursdayDisplayOption;
};

export type CourseScheduleRow = {
    id: string;
    date: string;
    day: string;
    unit: string;
    learningOutcomes: string;
    readingAssignments: string;
    dateTimestamp: number;
    sortableDateTimestamp: number;
};

export type CourseScheduleProps = {
    id: string;
    term?: unknown;
    year?: unknown;
    days?: unknown;
    data?: unknown;
};

/**
 * Course Constants
 */

export const DEFAULT_DATE_FORMAT: DateFormat = "mm/dd/yyyy";

export const COURSE_SCHEDULE_COLUMNS = [
    "Date",
    "Day",
    "Unit and Theme/Topic",
    "Learning Outcomes Addressed",
    "Reading/Assignments Due",
] as const;

export type CourseScheduleColumn = (typeof COURSE_SCHEDULE_COLUMNS)[number];

export const DAY_CODE_ORDER: DayCode[] = ["M", "T", "W", "R", "F", "S", "U"];

export const DAY_LONG_NAMES: Record<DayCode, string> = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    R: "Thursday",
    F: "Friday",
    S: "Saturday",
    U: "Sunday",
};

export const DAY_SHORT_NAMES: Record<DayCode, string> = {
    M: "Mon",
    T: "Tue",
    W: "Wed",
    R: "Thu",
    F: "Fri",
    S: "Sat",
    U: "Sun",
};

