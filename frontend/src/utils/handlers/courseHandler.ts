import { jsonFieldsMapper } from "../jsonFieldsMapper";
import { createNewCourse as apiCreateNewCourse, fetchCourses as apiFetchCourses } from "../../services/course/courseService";
import { Course } from "../../services/course/courseService";

type ModalControls = {
    setVisible: (visible: boolean) => void;
    setStatus: (status: "loading" | "success") => void;
    setTitle: (title: string) => void;
    setMessage: (message: string) => void;
};

export const createCourseHandler = (
    formData: Record<string, string>,
    modal: ModalControls,
    onSuccess: (courses: Course[]) => void
) => {
    return async () => {
        modal.setTitle("Creating Course");
        modal.setMessage("Please wait while we create your course...");
        modal.setStatus("loading");
        modal.setVisible(true);

        const mappedData = jsonFieldsMapper(formData);

        const result = await apiCreateNewCourse(mappedData);
        if (result !== null) {
            const updatedCourses = await apiFetchCourses();
            if (updatedCourses) {
                onSuccess(updatedCourses);
                modal.setStatus("success");
                modal.setTitle("Course Created");
                modal.setMessage("Your course was created successfully!");
                setTimeout(() => modal.setVisible(false), 1500);
            } else {
                modal.setVisible(false);
            }
        } else {
            modal.setVisible(false);
        }
    };
};
