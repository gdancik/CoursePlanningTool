import { useEffect, useRef } from "react";

import type { CourseScheduleRow } from "../types/courseScheduleTypes";
import type { UseCourseScheduleResult } from "./useCourseSchedule";

type CourseScheduleTableProps = {
    id: string;
    rows: CourseScheduleRow[];
} & Pick<
    UseCourseScheduleResult,
    | "addRow"
    | "deleteRow"
    | "updateDateField"
    | "normalizeDateField"
    | "updateRowField"
>;

type AutoResizeTextareaProps = {
    value: string;
    maxLength?: number;
    onChange: (value: string) => void;
    onBlur?: (value: string) => void;
};


function AutoResizeTextarea({
                                                                value,
                                                                maxLength,
                                                                onChange,
                                                                onBlur,
                                                            }: AutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const resizeTextarea = (textarea: HTMLTextAreaElement): void => {
        textarea.style.height = "auto";

        const minimumHeight = 80;
        const nextHeight = Math.max(textarea.scrollHeight, minimumHeight);

        textarea.style.height = `${nextHeight}px`;
    };

    useEffect(() => {
        if (textareaRef.current) {
            resizeTextarea(textareaRef.current);
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            className="block min-h-20 w-full resize-none overflow-hidden bg-transparent p-0 leading-6 outline-none focus:bg-transparent"
            maxLength={maxLength}
            rows={3}
            value={value}
            onChange={(event) => {
                onChange(event.target.value);
                resizeTextarea(event.target);
            }}
            onInput={(event) => resizeTextarea(event.currentTarget)}
            onBlur={(event) => onBlur?.(event.target.value)}
        />
    );
}

export function CourseScheduleTable({
                                        id,
                                        rows,
                                        addRow,
                                        deleteRow,
                                        updateDateField,
                                        normalizeDateField,
                                        updateRowField,
                                    }: CourseScheduleTableProps) {
    return (
        <div className="mx-[2%] my-4 overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50">
            <table id={id} className="w-full table-fixed border-collapse bg-white">
                <thead>
                <tr className="bg-blue-200 text-left text-blue-800">
                    <th className="w-[14%] border-b border-blue-300 px-3 py-4 font-bold">
                        Date
                    </th>
                    <th className="w-[15%] border-b border-blue-300 px-3 py-4 font-bold">
                        Day
                    </th>
                    <th className="w-[20%] border-b border-blue-300 px-3 py-4 font-bold">
                        Unit and Theme/Topic
                    </th>
                    <th className="w-[20%] border-b border-blue-300 px-3 py-4 font-bold">
                        Learning Outcomes Addressed
                    </th>
                    <th className="w-[20%] border-b border-blue-300 px-3 py-4 font-bold">
                        Reading/Assignments Due
                    </th>
                    <th className="w-[10%] border-b border-blue-300 px-3 py-4 font-bold" />
                </tr>
                </thead>

                <tbody>
                {rows.map((row, index) => (
                    <tr key={row.id} className="border-t border-blue-100">
                        <td className="border-r border-blue-200 bg-slate-50 px-3 py-3 align-top">
                            <AutoResizeTextarea
                                maxLength={30}
                                value={row.date}
                                onChange={(value) =>
                                    updateDateField(index, value)
                                }
                                onBlur={(value) =>
                                    normalizeDateField(index, value)
                                }
                            />
                        </td>

                        <td className="border-r border-blue-200 bg-slate-50 px-3 py-3 align-top">
                            <AutoResizeTextarea
                                maxLength={30}
                                value={row.day}
                                onChange={(value) =>
                                    updateRowField(index, "day", value)
                                }
                            />
                        </td>

                        <td className="border-r border-blue-200 bg-slate-50 px-3 py-3 align-top">
                            <AutoResizeTextarea
                                maxLength={200}
                                value={row.unit}
                                onChange={(value) =>
                                    updateRowField(index, "unit", value)
                                }
                            />
                        </td>

                        <td className="border-r border-blue-200 bg-slate-50 px-3 py-3 align-top">
                            <AutoResizeTextarea
                                maxLength={200}
                                value={row.learningOutcomes}
                                onChange={(value) =>
                                    updateRowField(
                                        index,
                                        "learningOutcomes",
                                        value
                                    )
                                }
                            />
                        </td>

                        <td className="border-r border-blue-200 bg-slate-50 px-3 py-3 align-top">
                            <AutoResizeTextarea
                                maxLength={200}
                                value={row.readingAssignments}
                                onChange={(value) =>
                                    updateRowField(
                                        index,
                                        "readingAssignments",
                                        value
                                    )
                                }
                            />
                        </td>

                        <td className="bg-slate-50 px-2 py-3 text-center align-top">
                            <div className="flex justify-center gap-1">
                                <button
                                    type="button"
                                    aria-label="Add row"
                                    className="rounded-md border-2 border-blue-400 bg-white px-2 py-0.5 text-lg font-bold leading-none text-blue-700 hover:bg-blue-50"
                                    onClick={() => addRow(index)}
                                >
                                    +
                                </button>

                                {rows.length > 1 && (
                                    <button
                                        type="button"
                                        aria-label="Delete row"
                                        className="rounded-md border-2 border-blue-400 bg-white px-2 py-0.5 text-lg font-bold leading-none text-slate-700 hover:bg-blue-50"
                                        onClick={() => deleteRow(index)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}