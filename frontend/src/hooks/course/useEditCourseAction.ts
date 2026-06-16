import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

import {getCourseData} from "../../services/course/courseAPI";
import {queryKeys} from "../../query/queryKeys";
import type {ModalFactory} from "../../utils/useModalFactory";

interface EditCourseParameters{
    userEmail?: string;
    modal: ModalFactory;
}

export const EditCourseActions = ({
    userEmail, modal, } : EditCourseParameters) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const editCourse = async(courseId: string, courseTitle: string)=> {
        if(!userEmail) {
            modal.showError("You are either no longer logged in or this page is stale. Please Log back in");
            return;
        }
        modal.showRedirect("Loading Course", `Fetching course daa for "${courseTitle}"...`, "loading" );

        try {
            const raw = await queryClient.ensureQueryData({
                queryKey: queryKeys.course(courseId),
                queryFn: () => getCourseData(courseId),
            });
            if (!raw) {
                throw new Error(`No Data for "${courseId}"`)
            }
            const course = {
                ...raw,
                course_id: courseId,
            };
            queryClient.setQueryData(queryKeys.course(courseId), course);
            queryClient.setQueryData(queryKeys.currentCourseId(userEmail), courseId);

            navigate("/overview");
        }catch (err:unknown) {
            console.error("Course handler EDIT failed:", err)

            const message = err instanceof Error ? err.message : "Something went wrong."
            modal.showError(message)
        }
    }
    return { editCourse,}

}