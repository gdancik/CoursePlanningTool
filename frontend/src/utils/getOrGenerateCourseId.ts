import { getNewCourseId } from "../services/TestServices/syllabusService";

export const getOrGenerateCourseId = async (mappedData: Record<string, string>): Promise<string | null> => {
    let course_id = mappedData["course_id"];
    if (!course_id) {
        const newId = await getNewCourseId();
        if (!newId) return null;
        course_id = newId;
        mappedData["course_id"] = newId;
    }
    return course_id;
};
