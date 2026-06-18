// src/hooks/course/useDeleteCourseAction.ts

import type { ModalFactory } from "../../utils/useModalFactory";
import { useDeleteCourseMutation } from "../mutations/useDeleteCourseMutation";

interface UseDeleteCourseActionParams {
    userEmail?: string;
    modal: ModalFactory;
}

export const useDeleteCourseAction = ({
                                          userEmail,
                                          modal,
                                      }: UseDeleteCourseActionParams) => {
    const deleteCourseMutation = useDeleteCourseMutation();

    const deleteCourse = async (courseId: string, courseTitle: string) => {
        if (!userEmail) {
            modal.showError("You must be logged in to delete a course.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this course? This action cannot be undone."
        );

        if (!confirmed) return;

        modal.showRedirect(
            "Deleting Course",
            "Please wait while we remove the course…",
            "loading"
        );

        try {
            await deleteCourseMutation.mutateAsync({
                courseId,
                userEmail,
            });

            modal.showRedirect(
                "Course Deleted",
                `Course ${courseTitle} has been removed.`,
                "success"
            );

            setTimeout(() => {
                modal.hide();
            }, 3000);
        } catch (err: unknown) {
            console.error("Delete course failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong while deleting the course.";

            modal.showError(message);
        }
    };

    return {
        deleteCourse,
    };
};