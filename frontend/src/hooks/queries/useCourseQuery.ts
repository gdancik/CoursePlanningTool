import { useQuery } from "@tanstack/react-query";

import { getCourseData } from "../../services/course/courseAPI";
import { queryKeys } from "../../query/queryKeys";

export const useCourseQuery = (courseId?: string) => {
    return useQuery({
        queryKey: queryKeys.course(courseId ?? ""),
        queryFn: () => getCourseData(courseId!),
        enabled: !!courseId,
    });
};