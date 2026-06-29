import { useEffect, useState } from "react";

import { triggerInput } from "../../../services/triggerInput";

import type {
    CourseScheduleProps,
    CourseScheduleRow,
    DateFormat,
} from "../types/courseScheduleTypes";

import {
    coerceToTrimmedString,
    normalizeCourseYear,
    normalizeDays,
    normalizeTerm,
    normalizeYearString,
} from "../utilities/normalizers";

import { createEmptyScheduleRow } from "../utilities/factories";

import { areRowsSortedByDate, mergeGeneratedRows } from "../utilities/rowUtils";

import { backendScheduleToRows } from "../utilities/mapper";

import {
    clearScheduleRows,
    deleteRowAtIndex, formatScheduleRowsByDate,
    insertEmptyRowAtIndex,
    normalizeDateFieldAtIndex,
    sortScheduleRowsByDate,
    updateDateFieldAtIndex,
    updateRowAtIndex,
} from "../utilities/modifiers/rowModifiers";

import { generateScheduleRows } from "./generateSchedule";
import { useGenerateScheduleMutation } from "../hooks/useGenerateScheduleMutation";

export const missingScheduleInfo = (
    term: unknown,
    year: unknown,
    days: unknown
): boolean => {
    const values = [term, year, days].map(coerceToTrimmedString);

    return values.some((value) => value === "");
};

export const useCourseSchedule = ({
                                      term,
                                      year,
                                      days,
                                      data,
                                  }: Omit<CourseScheduleProps, "id">) => {
    const normalizedTerm = normalizeTerm(term);
    const normalizedYear = normalizeYearString(year);
    const courseYear = normalizeCourseYear(year);
    const dateParsingYear = courseYear ?? new Date().getFullYear();
    const normalizedDays = normalizeDays(days);

    const generateScheduleMutation = useGenerateScheduleMutation();

    const [scheduleRows, setScheduleRows] = useState<CourseScheduleRow[]>([
        createEmptyScheduleRow(),
    ]);

    const [dateFormat, setDateFormat] =
        useState<DateFormat>("mm/dd/yyyy");

    const changeDateFormat = (nextDateFormat: DateFormat): void => {
        setDateFormat(nextDateFormat);
        setScheduleRows((currentRows) =>
            formatScheduleRowsByDate(
                currentRows, dateParsingYear, nextDateFormat
            )
        );
        triggerInput();
    }

    const missingScheduleInformation = missingScheduleInfo(
        normalizedTerm,
        normalizedYear,
        normalizedDays
    );

    const datesSorted = areRowsSortedByDate(scheduleRows, dateParsingYear);

    useEffect(() => {
        setScheduleRows(backendScheduleToRows(data, dateParsingYear));
    }, [data, dateParsingYear]);

    const addRow = (index: number): void => {
        setScheduleRows((currentRows) =>
            insertEmptyRowAtIndex(currentRows, index)
        );

        triggerInput();
    };

    const deleteRow = (index: number): void => {
        setScheduleRows((currentRows) => deleteRowAtIndex(currentRows, index));

        triggerInput();
    };

    const clearSchedule = (): void => {
        setScheduleRows((currentRows) => clearScheduleRows(currentRows));

        triggerInput();
    };

    const sortScheduleByDate = (): void => {
        setScheduleRows((currentRows) =>
            sortScheduleRowsByDate(currentRows, dateParsingYear)
        );

        triggerInput();
    };

    const updateRowField = <K extends keyof CourseScheduleRow>(
        index: number,
        field: K,
        value: CourseScheduleRow[K]
    ): void => {
        setScheduleRows((currentRows) =>
            updateRowAtIndex(currentRows, index, field, value)
        );
    };

    const updateDateField = (index: number, value: string): void => {
        setScheduleRows((currentRows) =>
            updateDateFieldAtIndex(currentRows, index, value, dateParsingYear)
        );
    };

    const normalizeDateField = (index: number, value: string): void => {
        setScheduleRows((currentRows) =>
            normalizeDateFieldAtIndex(
                currentRows,
                index,
                value,
                dateParsingYear,
                dateFormat
            )
        );

        triggerInput();
    };

    const generateSchedule = async (): Promise<void> => {
        const result = await generateScheduleRows({
            mutation: generateScheduleMutation,
            term: normalizedTerm,
            year: normalizedYear,
            days: normalizedDays,
            dateParsingYear,
            missingScheduleInformation,
        });

        if (!result.ok) {
            alert(result.error);
            return;
        }

        setScheduleRows((currentRows) =>
            mergeGeneratedRows(currentRows, result.generatedRows, dateParsingYear)
        );

        triggerInput();
    };

    return {
        scheduleRows,

        dateFormat,
        changeDateFormat,

        normalizedTerm,
        normalizedYear,
        normalizedDays,
        dateParsingYear,

        missingScheduleInformation,
        datesSorted,

        isGeneratingSchedule: generateScheduleMutation.isPending,

        addRow,
        deleteRow,
        clearSchedule,
        sortScheduleByDate,
        updateRowField,
        updateDateField,
        normalizeDateField,
        generateSchedule,
    };
};

export type UseCourseScheduleResult = ReturnType<typeof useCourseSchedule>;