import { getCourseData } from "../services/course/courseService";
import config from "../configs/courseConfig.json";
import { FormState } from "./types";

type loadCourseDataResult = {
    courseId: string | null;
    formData: FormState;
};

type courseDataStored = FormState & {
    course_id?: string;
    savedData?: FormState;
};

const emptyCourseData = (): loadCourseDataResult => ({
    courseId: null,
    formData: {},
});

export async function loadCourseData(): Promise<loadCourseDataResult> {
    const saved = localStorage.getItem("currentCourseData");

    if (!saved) {
        return emptyCourseData();
    }

    try {
        const parsed = JSON.parse(saved) as courseDataStored;
        const courseId = parsed.course_id ?? null;

        if (!courseId) {
            return emptyCourseData();
        }

        if ("loadData" in config && !config.loadData) {
            alert("loadData is set to False in courseConfig.json");
            return emptyCourseData();
        }

        try {
            const backendData = await getCourseData(courseId);

            if (backendData) {
                return {
                    courseId,
                    formData: backendData,
                };
            }
        } catch (error) {
            console.warn(
                "Backend not available, using localStorage data:",
                error
            );
        }

        const { savedData, ...courseData } = parsed;

        return {
            courseId,
            formData: savedData ?? courseData,
        };
    } catch {
        return emptyCourseData();
    }
}