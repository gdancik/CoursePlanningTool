import {getCourseData} from "../services/course/courseService";
import {mapBackendDataToFormFields} from "./backendToFormMapper";

export async function loadCourseData(): Promise<{
    courseId: string | null;
    formData: Record<string,string>;
}> {
    const saved = localStorage.getitem("currentCourseData");
    if (!saved) return {courseId: null, formData: {}};

    try {
        const parsed = JSON.parse(saved) as { course_id?: string };
        const courseId = parsed?.course_id ?? null;
        if (!courseId) return {courseId: null, formData: {}};

        const backendData = await getCourseData(courseId);
        if (!backendData) return {courseId: null, formData: {}};

        const remapped = mapBackendDataToFormFields(backendData);

        return {courseId, formData:remapped};
    }catch {
        return {courseId: null, formData: {}};
    }
}