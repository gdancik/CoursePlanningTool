import {getCourseData} from "../services/course/courseService";

export async function loadCourseData(): Promise<{
    courseId: string | null;
    formData: Record<string,string>;
}> {
    const saved = localStorage.getItem("currentCourseData");
    if (!saved) return {courseId: null, formData: {}};

    try {
        const parsed = JSON.parse(saved) as { course_id?: string };
        const courseId = parsed?.course_id ?? null;
        if (!courseId) return {courseId: null, formData: {}};

        const backendData = await getCourseData(courseId);
        if (!backendData) return {courseId: null, formData: {}};
        return {courseId, formData:backendData};
    }catch {
        return {courseId: null, formData: {}};
    }
}