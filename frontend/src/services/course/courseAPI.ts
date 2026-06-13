// src/services/courseApi.ts

import { createApiCaller } from "../../utils/apiFactory";
import { FormState } from "../../utils/types";
import {
    Course,
    CourseIdResponse,
    RawCreateCourseResponse,
} from "../courseTypes";

/**
 * Fetches a new course_id for the given user.
 */
export const getNewCourseId = async (
    userId: string
): Promise<CourseIdResponse | null> => {
    return createApiCaller<CourseIdResponse>({
        url: "getNewCourseId/",
        method: "POST",
        data: { user: userId },
    })();
};

/**
 * Loads all courses for the current user.
 */
export const getCourses = async (): Promise<Course[]> => {
    const raw = await createApiCaller<Record<string, FormState>>({
        url: "getSheet/",
        method: "POST",
        data: {},
    })();

    if (!raw) return [];

    return Object.entries(raw).map(([courseId, courseData]) => ({
        ...courseData,
        course_id: courseId,
    })) as Course[];
};

/**
 * Fetches the full data object for a single course.
 */
export const getCourseData = async (
    courseId: string
): Promise<FormState | null> => {
    return createApiCaller<FormState>({
        url: "getCourse/",
        method: "POST",
        data: { course_id: courseId },
    })();
};

/**
 * Updates or creates values for a given course.
 */
export const updateCourseValues = async (
    courseId: string,
    values: Partial<FormState>
): Promise<void | null> => {
    return createApiCaller<void>({
        url: "updateValue/",
        method: "POST",
        data: {
            course_id: courseId,
            dict_of_columns_and_vals: values,
        },
        responseType: "empty",
    })();
};

/**
 * Creates a new course row and returns its ID.
 */
export const createNewCourse = async (
    data: FormState
): Promise<CourseIdResponse | null> => {
    const raw = await createApiCaller<RawCreateCourseResponse>({
        url: "createNewCourse/",
        method: "POST",
        data: { dict_of_columns_and_vals: data },
    })();

    if (!raw) return null;

    const id = raw.course_id ?? raw.courseId ?? raw["courseId:"];

    if (typeof id !== "string") return null;

    return { course_id: id };
};

/**
 * Deletes a course row.
 */
export const deleteCourseRow = async (
    courseId: string
): Promise<CourseIdResponse | null> => {
    return createApiCaller<CourseIdResponse>({
        url: "deleteCourse/",
        method: "POST",
        data: { course_id: courseId },
    })();
};

/**
 * Duplicates a course row and returns the new course ID.
 */
export const duplicateCourse = async (
    courseId: string
): Promise<CourseIdResponse | null> => {
    return createApiCaller<CourseIdResponse>({
        url: "duplicateCourse/",
        method: "POST",
        data: { course_id: courseId },
    })();
};

/**
 * Generates a syllabus preview PDF/blob.
 */
export const previewSyllabus = async (
    courseId: string
): Promise<Blob | null> => {
    return createApiCaller<Blob>({
        url: "preview/",
        method: "POST",
        data: { course_id: courseId },
        responseType: "blob",
    })();
};

/**
 * Logs the user out.
 */
export const logoutUser = async (): Promise<void | null> => {
    return createApiCaller<void>({
        url: "logout/",
        method: "GET",
        responseType: "empty",
    })();
};