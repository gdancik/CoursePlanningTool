import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createNewCourse,
    getCourseData,
} from "../../services/course/courseAPI";

import { queryKeys } from "../../query/queryKeys";
import { FormState} from "../../utils/PageRenderEngine/types";
import { RawCourseData } from "../../services/courseTypes";
import { buildCourseFromRaw } from "../../utils/course/buildCourseFromRaw";
import {getDefaultSyllabusValues} from "../../services/course/getDefaultSyllabusValues";

interface CreateCourseVariables {
    formData: FormState;
    userEmail: string;
}

export const useCreateCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ formData }: CreateCourseVariables) => {

           const dataToCreate = {
                ...getDefaultSyllabusValues(),...formData
            }
            const createResult = await createNewCourse(dataToCreate);
            const newId = createResult?.course_id;

            if (typeof newId !== "string") {
                throw new Error("No course_id returned from createNewCourse");
            }

            const raw = (await getCourseData(newId)) as RawCourseData | null;

            if (!raw) {
                throw new Error(`Could not fetch data for course ${newId}`);
            }

            return buildCourseFromRaw(raw, newId);
        },

        onSuccess: (newCourse, variables) => {
            queryClient.setQueryData(
                queryKeys.course(newCourse.course_id),
                newCourse
            );

            queryClient.invalidateQueries({
                queryKey: queryKeys.courses(variables.userEmail),
            });
        },
    });
};