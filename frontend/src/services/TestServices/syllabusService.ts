import { createApiCaller } from "../../utils/apiFactory";

export const saveToBackend = async (
    course_id: string,
    values: Record<string, string>
) => {
    return await createApiCaller<void>({
        method: "POST",
        url: "updateValue/",
        data: {
            course_id,
            dict_of_columns_and_vals: values,
        },
    })();
};

export const previewSyllabus = async (course_id: string): Promise<Blob | null> => {
    return await createApiCaller<Blob>({
        method: "POST",
        url: "/preview/",
        data: { course_id },
        responseType: "blob",
    })();
};

export const logoutUser = async () => {
    return await createApiCaller<void>({
        method: "GET",
        url: "/logout/",
    })();
};

export const getNewCourseId = async (): Promise<string | null> => {
    return await createApiCaller<{ course_id: string }>({
        method: "POST",
        url: "/getNewCourseId/",
        data: { user: "annie" }, // replace with actual user ID if you have it
    })().then(res => res?.course_id ?? null);
};
