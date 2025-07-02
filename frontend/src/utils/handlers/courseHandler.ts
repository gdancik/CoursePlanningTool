import { jsonFieldsMapper } from "../jsonFieldsMapper";
import {
    createNewCourse as apiCreateNewCourse,
    getCourses as apiFetchCourses,
    Course
} from "../../services/course/courseService";

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

        //  Call the backend to create the course (writes to sheet)
        const result = await apiCreateNewCourse(mappedData);
        if (!result) {
            modal.setVisible(false);
            return;
        }

        //  Fetch all current courses (sheet rows)
        const allCourses = await apiFetchCourses();
        if (!allCourses) {
            modal.setVisible(false);
            return;
        }

        //  Match the course we just created
        const newCourse = allCourses.find(course =>
            course.course_title_syllabus === mappedData.course_title_syllabus &&
            course.instructor_name_syllabus === mappedData.instructor_name_syllabus &&
            course.term_syllabus === mappedData.term_syllabus
        );

        if (!newCourse?.course_id) {
            console.error("Could not find created course in sheet.");
            modal.setVisible(false);
            return;
        }

        //  Add course_id and store for use in future saves
        const dataToSave = {
            ...mappedData,
            course_id: newCourse.course_id
        };

        localStorage.setItem("newCourseData", JSON.stringify(dataToSave));

        //  Notify and return
        onSuccess(allCourses);
        modal.setStatus("success");
        modal.setTitle("Course Created");
        modal.setMessage("Your course was created successfully!");
        setTimeout(() => modal.setVisible(false), 1500);
    };
};
