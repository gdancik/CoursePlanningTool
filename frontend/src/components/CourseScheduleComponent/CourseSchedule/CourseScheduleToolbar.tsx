import { useRef } from "react";

import type {
    DateFormat,
    ThursdayDisplayOption,
} from "../types/courseScheduleTypes";

import type { UseCourseScheduleResult } from "./useCourseSchedule";
import Checkbox from "../../SyllabusComponents/Checkbox";
import ReusableButton from "../../Button/ReusableButton";

type CourseScheduleToolbarProps = Pick<
    UseCourseScheduleResult,
    | "missingScheduleInformation"
    | "normalizedTerm"
    | "normalizedYear"
    | "normalizedDays"
    | "isGeneratingSchedule"
    | "dateFormat"
    | "datesSorted"
    | "generateSchedule"
    | "clearSchedule"
    | "sortScheduleByDate"
    | "changeDateFormat"
    | "dayDisplayOption"
    | "useOneLetterDays"
    | "changeUseOneLetterDays"
    | "changeThursdayDisplayOption"
    | "downloadExcelTemplate"
    | "exportScheduleToExcel"
    | "importScheduleFromExcel"
>;

const selectClassName =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm " +
    "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";

export function CourseScheduleToolbar({
                                          missingScheduleInformation,
                                          normalizedTerm,
                                          normalizedYear,
                                          normalizedDays,
                                          isGeneratingSchedule,
                                          dateFormat,
                                          datesSorted,
                                          generateSchedule,
                                          clearSchedule,
                                          sortScheduleByDate,
                                          changeDateFormat,
                                          dayDisplayOption,
                                          useOneLetterDays,
                                          changeUseOneLetterDays,
                                          changeThursdayDisplayOption,
                                          downloadExcelTemplate,
                                          exportScheduleToExcel,
                                          importScheduleFromExcel,
                                      }: CourseScheduleToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="mx-[2%] my-4 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <ReusableButton
                        label={
                            isGeneratingSchedule
                                ? "Generating..."
                                : `Generate Schedule (${normalizedTerm} ${normalizedYear}, ${normalizedDays})`
                        }
                        variant="primary"
                        onClick={generateSchedule}
                        disabled={
                            missingScheduleInformation ||
                            isGeneratingSchedule
                        }
                    />

                    <ReusableButton
                        label="Clear Schedule"
                        variant="primary"
                        onClick={clearSchedule}
                    />

                    <ReusableButton
                        label="Download Template"
                        variant="primary"
                        onClick={downloadExcelTemplate}
                    />

                    <ReusableButton
                        label="Export Excel"
                        variant="primary"
                        onClick={exportScheduleToExcel}
                    />

                    <ReusableButton
                        label="Import Excel"
                        variant="primary"
                        onClick={() => fileInputRef.current?.click()}
                    />

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (!file) {
                                return;
                            }

                            void importScheduleFromExcel(file);

                            event.target.value = "";
                        }}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                        <span>Date format:</span>
                        <select
                            className={selectClassName}
                            value={dateFormat}
                            onChange={(event) =>
                                changeDateFormat(
                                    event.target.value as DateFormat
                                )
                            }
                        >
                            <option value="mm/dd">mm/dd</option>
                            <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                            <option value="mm/dd/yy">mm/dd/yy</option>
                        </select>
                    </label>

                    <Checkbox
                        id="course-schedule-one-letter-days"
                        label="Use one-letter days"
                        checked={useOneLetterDays}
                        onChange={changeUseOneLetterDays}
                    />

                    {useOneLetterDays && (
                        <label className="flex items-center gap-2 font-medium text-slate-800">
                            <span>Thursday:</span>
                            <select
                                className={selectClassName}
                                value={dayDisplayOption.thursdayOption}
                                onChange={(event) =>
                                    changeThursdayDisplayOption(
                                        event.target
                                            .value as ThursdayDisplayOption
                                    )
                                }
                            >
                                <option value="R">R</option>
                                <option value="Th">Th</option>
                            </select>
                        </label>
                    )}

                    <ReusableButton
                        label="Sort by date"
                        variant="primary"
                        onClick={sortScheduleByDate}
                        disabled={datesSorted}
                    />
                </div>
            </div>

            {missingScheduleInformation && (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 font-semibold text-red-700">
                    Note: for the option to autogenerate your schedule, enter a
                    term, year, and days on the Basic Information page.
                </p>
            )}
        </div>
    );
}