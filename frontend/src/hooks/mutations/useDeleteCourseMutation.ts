import {useMutation, useQueryClient} from "@tanstack/react-query";

import {deleteCourseRow} from "../../services/course/courseAPI";
import {queryKeys} from "../../query/queryKeys";

interface DeleteCourseVariables {
    courseId: string;
    userEmail: string;
}

export const useDeleteCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({courseId}: DeleteCourseVariables) => {
            const response = await deleteCourseRow(courseId);

            if(!response) { throw new Error ("Course could not be deleted"); }
            return response;
        },
        onSuccess:(_response, variables) => {
            queryClient.invalidateQueries({queryKey: queryKeys.courses(variables.userEmail),});

            queryClient.removeQueries({queryKey: queryKeys.course(variables.courseId), exact: true,})
        },
    });
};