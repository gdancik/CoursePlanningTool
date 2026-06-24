import type {DayCode, NormalizedYear} from "./courseScheduleTypes";
import {DAY_CODE_ORDER} from "./courseScheduleTypes";

export const coerceToTrimmedString = (value: unknown) => {
    if (value === undefined || value === null) {
        return "";
    }
    if (Array.isArray(value)) {
        return value.join("").trim();
    }
    return String(value).trim();
}
/**
 * Normalize Term
 */
export const normalizeTerm =(value: unknown) => {
    const trimmed = coerceToTrimmedString(value);
    if (!trimmed) {
        return "";
    }
    const lower = trimmed.toLowerCase();
    const termMap: Record<string, string> = {
        fall: "Fall",
        winter: "Winter",
        spring: "Spring",
        summer: "Summer",
    };
    return termMap [lower] || trimmed;
}
/**
 * Normalize Years
 */


export const normalizeYearString = (value: unknown): string => {
    const trimmed = coerceToTrimmedString(value);
    const yearMatch = trimmed.match(/\d{4}/);

    return yearMatch ? yearMatch[0] : "";
};

export const normalizeCourseYear = (
    value: unknown
): NormalizedYear | null => {
    const yearString = normalizeYearString(value);

    if (!yearString) {
        return null;
    }

    const year = Number(yearString);

    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
        return null;
    }

    return year as NormalizedYear;
};

/**
 * Normalize Days
 */

export const normalizeDays = (value: unknown): string => {
    return normalizeDaysToCodes(value).join("");
};

/**
 * Normalize Days to Codes
 */

export const normalizeDaysToCodes = (value: unknown): DayCode[] => {
    const tokens = splitDayInput(value);

    const codes = tokens
        .map((token) => DAY_ALIASES[token.trim().toLowerCase()])
        .filter((code): code is DayCode => Boolean(code));

    return DAY_CODE_ORDER.filter((dayCode) => codes.includes(dayCode));
};

/**
 * NORMALIZE DAYS ALIASES
 */

const DAY_ALIASES: Record<string, DayCode> = {
    m: "M", mon: "M", monday: "M",
    t: "T", tue: "T", tues: "T", tuesday: "T",
    w: "W", wed: "W", wednesday: "W",
    r: "R", th: "R", thurs: "R", thursday: "R",
    f: "F", fri: "F", friday: "F",
    s: "S", sat: "S", saturday: "S",
};
/**
 * NORMALIZE DAYS SPLIT
 */

const splitDayInput = (value: unknown): string[] => {
    if (value === undefined || value === null) {
        return [];
    }

    if (Array.isArray(value)) {
        return value.flatMap(splitDayInput);
    }

    const raw = String(value).trim();

    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
            return parsed.flatMap(splitDayInput);
        }
    } catch {
    }
    const compact = raw.replace(/\s/g, "");

    if (/^[MTWRFSU]+$/i.test(compact)) {
        return compact.split("");
    }


    return raw
        .replace(/TTh/gi, "T Th")
        .replace(/TuTh/gi, "Tu Th")
        .split(/[,/|;&\s]+/)
        .filter(Boolean);
};
