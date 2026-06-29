import type { DateFormat} from "../types/courseScheduleTypes";
import type { UseCourseScheduleResult} from "./useCourseSchedule";

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
>;

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
                                      }: CourseScheduleToolbarProps) {
    return (
        <>
            <div style={{ margin: "1%" }}>
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                    }}
                >
                    <button
                        className="reusable-button primary"
                        onClick={generateSchedule}
                        disabled={missingScheduleInformation || isGeneratingSchedule}
                    >
                        {isGeneratingSchedule
                            ? "Generating..."
                            : `Generate Schedule (${normalizedTerm} ${normalizedYear}, ${normalizedDays})`}
                    </button>

                    <button
                        className="reusable-button primary"
                        onClick={clearSchedule}
                    >
                        Clear Schedule
                    </button>
                </div>

                {missingScheduleInformation && (
                    <p style={{ color: "darkred", fontWeight: "bold" }}>
                        Note: for the option to autogenerate your schedule, enter a term,
                        year, and days on the Basic Information page.
                    </p>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                    marginRight: "2%",
                    alignItems: "center",
                }}
            >
                <label>
                    Date format:&nbsp;
                    <select
                        value={dateFormat}
                        onChange={(event) =>
                            changeDateFormat(event.target.value as DateFormat)
                        }
                    >
                        <option value="mm/dd">mm/dd</option>
                        <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                        <option value="mm/dd/yy">mm/dd/yy</option>
                    </select>
                </label>

                <button
                    className="reusable-button primary"
                    onClick={sortScheduleByDate}
                    disabled={datesSorted}
                >
                    Sort by date
                </button>
            </div>
        </>
    );
}