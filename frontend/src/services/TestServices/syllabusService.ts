import api from '../../api/axios';

export async function saveToBackend (course_id: string, values: Record<string,string>) {
    return api.post("/updateValue/", {
        course_id,
        dict_of_columns_and_vals: values,
    });
}

export async function previewSyllabus(course_id: string): Promise<Blob>{
    const response = await api.post("/preview/", {
        course_id,
    }, {
        responseType: "blob",
    });
    return response.data;
}

export async function logoutUser() {
    return api.get("/logout/");
}