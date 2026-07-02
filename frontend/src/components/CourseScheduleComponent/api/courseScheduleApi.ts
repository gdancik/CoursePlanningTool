import apiClient from "../../../services/apiClient";

export type GenerateScheduleRequest = {
    term:string;
    year: string,
    days: string,
}

export type GeneratedScheduleItem = {
    Date?: string;
    Day?: string;
    Description?: string;
}

export type GenerateScheduleResponse = {
    error?: string;
    schedule?: GeneratedScheduleItem[];
};

export const generateCourseSchedule = async (
    request: GenerateScheduleRequest
): Promise<GenerateScheduleResponse> => {
    return apiClient.post("generateSchedule/", {
        json: request,
    }).
    json<GenerateScheduleResponse>();
};