import type { UseMutationResult } from "@tanstack/react-query";

import type { CourseScheduleRow } from "../types/courseScheduleTypes";
import { generatedScheduleItemsToRows } from "../utilities/mapper";

import type {
    GenerateScheduleRequest,
    GenerateScheduleResponse,
} from "../api/courseScheduleApi";

type GenerateScheduleMutation = UseMutationResult<
    GenerateScheduleResponse,
    Error,
    GenerateScheduleRequest
>;

type GenerateScheduleRowsInput = {
    mutation: GenerateScheduleMutation;
    term: string;
    year: string;
    days: string;
    dateParsingYear: number;
    missingScheduleInformation: boolean;
};

type GenerateScheduleRowsResult =
    | {
    ok: true;
    generatedRows: CourseScheduleRow[];
}
    | {
    ok: false;
    error: string;
};

export const generateScheduleRows = async ({
                                               mutation,
                                               term,
                                               year,
                                               days,
                                               dateParsingYear,
                                               missingScheduleInformation,
                                           }: GenerateScheduleRowsInput): Promise<GenerateScheduleRowsResult> => {
    if (missingScheduleInformation) {
        return {
            ok: false,
            error:
                "Please provide valid term, year, and days before generating a schedule.",
        };
    }

    try {
        const scheduleData = await mutation.mutateAsync({
            term,
            year,
            days,
        });

        if (scheduleData.error) {
            return {
                ok: false,
                error: `Schedule can’t be generated: ${scheduleData.error}`,
            };
        }

        if (!Array.isArray(scheduleData.schedule)) {
            return {
                ok: false,
                error: "Schedule can’t be generated: invalid response from server.",
            };
        }

        return {
            ok: true,
            generatedRows: generatedScheduleItemsToRows(
                scheduleData.schedule,
                dateParsingYear
            ),
        };
    } catch (error: unknown) {
        console.error("Error generating schedule", error);

        let apiMessage = "";

        try {
            const maybeKyError = error as {
                response?: {
                    json: () => Promise<{ error?: string }>;
                };
            };

            if (maybeKyError.response) {
                const body = await maybeKyError.response.json();
                apiMessage = body?.error ?? "";
            }
        } catch {
            apiMessage = "";
        }

        return {
            ok: false,
            error: apiMessage
                ? `Schedule can’t be generated: ${apiMessage}`
                : "Schedule can’t be generated. Please check your term, year, and days, or try again later.",
        };
    }
};