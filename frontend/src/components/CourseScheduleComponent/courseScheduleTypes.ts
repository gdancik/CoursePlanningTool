export type DateFormat = "mm/dd" | "mm/dd/yyyy" | "mm/dd/yy";

export type DayCodes = "M" | "T" | "W" | "R" | "F" | "S";

export type ThursdayOption = "R" | "Th";

export type DayDisplayFormats = "codes" | "shortNames" | "longNames";

export type DayDisplayOption = {
    format: DayDisplayFormats;
    thursdayOption: ThursdayOption;
}

export type CourseScheduleRow = {
    id: string;
    date: string;
    day: string;
    unit: string;
    learningOutcomes: string;
    readingAssignments: string;
    dateTimeStamp: number;
    sortDateTimeStamp: number;
};

export type CourseScheduleProps = {
    id: string;
    term?: unknown;
    year?: unknown;
    days?: unknown;
    data?: unknown;
};