import {useMutation, useQueryClient} from "@tanstack/react-query";
import {duplicateCourse} from "../../services/course/courseAPI";

import {queryKeys} from "../../query/queryKeys";

interface DupeCourseVars {
    courseId: string;
    userEmail: string;
}

export const useDuplicateCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               courseId,
                           }: DupeCourseVars): Promise<{ course_id: string }> => {
            const resp = await duplicateCourse(courseId);

            const newId = resp?.course_id;

            if (typeof newId !== "string") {
                throw new Error("Cannot Duplicate Course")
            }

            return {
                course_id: newId,
            };

        },
        onSuccess: (_resp, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.courses(variables.userEmail),
            });
        },
    })
}

    // Promise<{ course_id: string }>