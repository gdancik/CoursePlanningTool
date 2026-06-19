import type {ModalFactory} from "../../utils/useModalFactory";
import {useDuplicateCourseMutation} from "../mutations/useDuplicateCourseMutation";

interface useDuplicateCourseParameters {
    userEmail?: string;
    modal: ModalFactory;
}

export const useDuplicateCourseAction = ({
    userEmail, modal
}: useDuplicateCourseParameters) => {
    const duplicateCourseMutation = useDuplicateCourseMutation();

    const duplicateCourse = async (
        courseId: string,
        courseTitle: string
    )=> {
        if(!userEmail) {
            modal.showError ("You must be logged in to duplicate a course.");
            return;
        }
        modal.showRedirect("Duplicate Course", "Please wait while we duplicate the course...", "loading");

        try {
            const response = await duplicateCourseMutation.mutateAsync({
                courseId, userEmail,
            });
            modal.showRedirect(
                "Course Duplicated",
                `${courseTitle} has been duplicated with ID: ${response.course_id}`,
                "success"
            );

            setTimeout(() => {
                modal.hide();
            }, 3000);
        } catch (err: unknown) {
            console.error("Duplicate course failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong while duplicating the course.";

            modal.showError(message);

        }
    };
    return{duplicateCourse};
}