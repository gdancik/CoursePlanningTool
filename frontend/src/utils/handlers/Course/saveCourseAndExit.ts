import saveData from "../../../services/processData";
import { FormState } from "../../PageRenderEngine/types";
import { queryClient } from "../../../query/queryClient";
import { queryKeys } from "../../../query/queryKeys";

export async function saveCourseAndExit({
                                            formData,
                                            containerRef,
                                            modal,
                                            navigate,
                                            navigate_to = "/course-page",
                                            course_id,
                                            userEmail,
                                        }: {
    formData: FormState;
    containerRef: React.RefObject<HTMLDivElement>;
    modal: any;
    navigate: (path: string) => void;
    navigate_to?: string;
    course_id?: string;
    userEmail?: string;
}) {
    if (!course_id) {
        modal.showError("No course ID found. Please reopen the course.");
        setTimeout(() => modal.hide(), 2500);
        return;
    }

    try {
        modal.showRedirect("Saving", "Saving your changes...", "loading");

        await saveData(containerRef, course_id, formData);

        if (userEmail) {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.courses(userEmail),
            });

            await queryClient.invalidateQueries({
                queryKey: queryKeys.course(course_id),
            });
        }

        if (navigate_to === "/course-page") {
            modal.hide();
            navigate(navigate_to);
            return;
        }

        modal.showRedirect(
            "Saved",
            "Redirecting...",
            "success"
        );

        setTimeout(() => {
            modal.hide();
            navigate(navigate_to);
        }, 3000);
    } catch (err: any) {
        modal.showError(err?.message || "An unexpected error occurred.");
        setTimeout(() => modal.hide(), 2500);
    }
}