import { saveToBackend, logoutUser, previewSyllabus, getNewCourseId} from "../../services/TestServices/syllabusService";
import { getOrGenerateCourseId } from "../../utils/getOrGenerateCourseId";
import {saveJsonFile} from "../../components/Button/ButtonLogic";
import {jsonFieldsMapper} from "../jsonFieldsMapper";

export const createSaveHandler = (formData: Record<string, string>) => {
    return async () => {
        const mappedData = jsonFieldsMapper(formData);

        const course_id = await getOrGenerateCourseId(mappedData);
        if (!course_id) return;

        const result = await saveToBackend(course_id, mappedData);
        if (result !== null) {
            saveJsonFile(mappedData, "form_data.json");
        }
    };
};
export const createSaveAndExitHandler = (
    formData: Record<string, string>,
    navigate: (path: string) => void
) => {
    return async () => {
        const mappedData = jsonFieldsMapper(formData);

        const course_id = await getOrGenerateCourseId(mappedData);
        if (!course_id) return;

        const saveResult = await saveToBackend(course_id, mappedData);
        if (saveResult !== null) {
            saveJsonFile(mappedData, "form_data_exit.json");
            const logoutResult = await logoutUser();
            if (logoutResult !== null) {
                navigate("/login");
            }
        }
    };
};

export const createPreviewHandler = (
    formData: Record<string, string>
) => {
    return async () => {
        const mappedData = jsonFieldsMapper(formData);

        const course_id = await getOrGenerateCourseId(mappedData);
        if (!course_id) return;

        const saveResult = await saveToBackend(course_id, mappedData);
        if (saveResult !== null) {
            const blob = await previewSyllabus(course_id);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "syllabus_preview.docx";
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }
    };
};