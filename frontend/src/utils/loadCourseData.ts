import {getCourseData} from "../services/course/courseService";
import config from "../config.json"
import {FormState} from "./types";

export async function loadCourseData(): Promise<{
    courseId: string | null;
    formData: FormState;
}> {
    const saved = localStorage.getItem("currentCourseData");
    if (!saved) return {courseId: null, formData: {}};

    try {
        const parsed = JSON.parse(saved) as { course_id?: string; savedData?: Record<string, string> };
        const courseId = parsed?.course_id ?? null;
        if (!courseId) return {courseId: null, formData: {}};

        if ('loadData' in config && !config['loadData']) {
            alert('loadData is set to False in config.json')
            return {courseId: null, formData: {}};
        }

        // Try to fetch from backend
        try {
            const backendData = await getCourseData(courseId);
            if (backendData) return {courseId, formData: backendData};
        } catch (error) {
            console.warn('Backend not available, using localStorage data:', error);
        }
        
        // Fallback to localStorage savedData if backend fails
        const localData = parsed.savedData || {};
        return {courseId, formData: localData};
    } catch {
        return {courseId: null, formData: {}};
    }
}