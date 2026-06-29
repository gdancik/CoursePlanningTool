import {useMutation} from "@tanstack/react-query"

import {
    generateCourseSchedule,
    type GenerateScheduleRequest,
    type GenerateScheduleResponse
} from "../api/courseScheduleApi";

export const useGenerateScheduleMutation = () =>
    useMutation<GenerateScheduleResponse, Error, GenerateScheduleRequest> ({
        mutationFn: generateCourseSchedule,
    });