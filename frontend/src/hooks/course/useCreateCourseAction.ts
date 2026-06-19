import type { ModalFactory } from "../../utils/useModalFactory";
import { FormState} from "../../utils/PageRenderEngine/types";
import { useCreateCourseMutation } from "../mutations/useCreateCourseMutation";

interface UseCreateCourseActionParams {
    userEmail?: string;
    modal: ModalFactory;
}

export const useCreateCourseAction = ({
                                          userEmail,
                                          modal,
                                      }: UseCreateCourseActionParams) => {
    const createCourseMutation = useCreateCourseMutation();

    const createCourse = async (formData: FormState) => {
        if (!userEmail) {
            modal.showError(
                "You are either no longer logged in or this page is stale. Please log back in."
            );
            return;
        }

        modal.showRedirect(
            "Creating Course",
            "Creating your course...",
            "loading"
        );

        try {
            const newCourse = await createCourseMutation.mutateAsync({
                formData,
                userEmail,
            });

            modal.showRedirect(
                "Course Created",
                `Course ${newCourse.course_title_syllabus || newCourse.course_id} created!`,
                "success"
            );

            setTimeout(() => {
                modal.hide();
            }, 2500);
        } catch (err: unknown) {
            console.error("Course creation failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred.";

            modal.showError(message);
        }
    };

    return {
        createCourse,
    };
};