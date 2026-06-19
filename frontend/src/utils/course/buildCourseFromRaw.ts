import {
    Course,
    RawCourseData,
} from "../../services/courseTypes";

export const buildCourseFromRaw = (
    raw: RawCourseData,
    courseId: string
): Course => {
    return {
        ...raw,

        course_id: courseId,

        course_title_syllabus:
            raw.course_title_syllabus ??
            raw["Course Title"] ??
            "",

        subj_code_syllabus:
            raw.subj_code_syllabus ??
            raw["Course Code"] ??
            "",

        crse_number_syllabus:
            raw.crse_number_syllabus ??
            raw["Course Number"] ??
            "",

        instructor_name_syllabus:
            raw.instructor_name_syllabus ??
            raw["Instructor Name"] ??
            "",

        term_syllabus:
            raw.term_syllabus ??
            raw["Semester"] ??
            "",

        year_syllabus:
            raw.year_syllabus ??
            raw["Year"] ??
            "",

        last_edited:
            raw.last_edited ??
            raw["Last Edited"] ??
            new Date().toISOString(),
    };
};