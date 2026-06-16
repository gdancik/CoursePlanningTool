import {useQuery} from "@tanstack/react-query";
import {getCourses} from "../../services/course/courseAPI"
import {queryKeys} from "../../query/queryKeys";

export const useCoursesQuery = (userEmail?: string) => {
    return useQuery({
        queryKey: queryKeys.courses(userEmail ?? ""),
        queryFn: getCourses,
        enabled: !!userEmail,
    })
}