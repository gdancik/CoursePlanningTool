import {CourseScheduleRow} from "../types/courseScheduleTypes";
import {INVALID_DATE_TIMESTMP} from "./dateUtils";
export const createScheduleRowId = (): string => crypto.randomUUID();


export const createEmptyScheduleRow = (): CourseScheduleRow => ({
    id: createScheduleRowId(),
    date: "",
    day: "",
    unit: "",
    learningOutcomes: "",
    readingAssignments: "",
    dateTimestamp: INVALID_DATE_TIMESTMP,
    sortableDateTimestamp: INVALID_DATE_TIMESTMP
});

/**
 * Create Schedule Row
 */
type CreateScheduleRowInput = {
    date: string;
    day: string;
    unit?: string;
    learningOutcomes?: string;
    readingAssignments?: string;
    defaultYear: string;
};
