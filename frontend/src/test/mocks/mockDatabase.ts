import { FormState } from "../../utils/PageRenderEngine/types";

const initialCourses: Record<string, FormState> = {};

let courses: Record<string, FormState> =
    structuredClone(initialCourses);

export const mockDb = {
    getAllCourses() {
        return courses;
    },

    getCourse(courseId: string) {
        return courses[courseId] ?? null;
    },

    createCourse(data: FormState) {
        const courseId = `TEST-${crypto.randomUUID()}`;

        courses[courseId] = data;

        return {
            course_id: courseId,
        };
    },

    updateCourse(
        courseId: string,
        values: Partial<FormState>
    ) {
        const existing = courses[courseId];

        if (!existing) {
            return false;
        }

        courses[courseId] = {
            ...existing,
            ...values,
        };

        return true;
    },

    deleteCourse(courseId: string) {
        if (!courses[courseId]) {
            return false;
        }

        delete courses[courseId];
        return true;
    },

    duplicateCourse(courseId: string) {
        const existing = courses[courseId];

        if (!existing) {
            return null;
        }

        const newCourseId = `TEST-${crypto.randomUUID()}`;

        courses[newCourseId] = structuredClone(existing);

        return {
            course_id: newCourseId,
        };
    },

    reset() {
        courses = structuredClone(initialCourses);
    },
};