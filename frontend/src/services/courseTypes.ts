// src/services/courseTypes.ts

import { FormState, FormValue } from "../utils/PageRenderEngine/types";

export interface Course extends FormState {
    course_id: string;
    course_title_syllabus: string;
    subj_code_syllabus: string;
    crse_number_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    year_syllabus: string;
    last_edited: string;
    created_at?: string;
    course_type?: string;
    [key: string]: FormValue;
}

export interface CourseIdResponse {
    course_id: string;
}

export interface RawCreateCourseResponse {
    course_id?: unknown;
    courseId?: unknown;
    "courseId:"?: unknown;
}

export type RawCourseData = FormState & {
    "Course Title"?: string;
    "Course Code"?: string;
    "Course Number"?: string;
    "Instructor Name"?: string;
    "Semester"?: string;
    "Year"?: string;
    "Last Edited"?: string;

    course_title_syllabus?: string;
    subj_code_syllabus?: string;
    crse_number_syllabus?: string;
    instructor_name_syllabus?: string;
    term_syllabus?: string;
    year_syllabus?: string;
    last_edited?: string;
};