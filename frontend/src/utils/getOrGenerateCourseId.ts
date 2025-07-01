import { getNewCourseId } from "../services/TestServices/syllabusService";

export const getOrGenerateCourseId = async (mappedData: Record<string, string>): Promise<string | null> => {
    //  Try to get existing selected course from localStorage
    let course_id = localStorage.getItem("selectedCourse");

    if (!course_id) {
        // Fallback to checking mapped data (for legacy support or if passed directly)
        course_id = mappedData["course_id"];
    }

    if (!course_id) {
        const newId = await getNewCourseId();
        if (!newId) return null;
        course_id = newId;
    }

    // Always update mappedData in case it's used again
    mappedData["course_id"] = course_id;
    return course_id;
};
