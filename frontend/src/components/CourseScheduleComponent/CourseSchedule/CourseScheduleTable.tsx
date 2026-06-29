import type { CourseScheduleRow} from "../types/courseScheduleTypes";
import type { UseCourseScheduleResult} from "./useCourseSchedule";

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
        <table id={id} style={{ margin: "2%" }}>
            <thead>
            <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Unit and Theme/Topic</th>
                <th>Learning Outcomes Addressed</th>
                <th>Reading/Assignments Due</th>
                <th></th>
            </tr>
            </thead>

            <tbody>
            {rows.map((row, index) => (
                <tr key={row.id}>
                    <td>
                            <textarea
                                maxLength={30}
                                value={row.date}
                                onChange={(event) =>
                                    updateDateField(index, event.target.value)
                                }
                                onBlur={(event) =>
                                    normalizeDateField(index, event.target.value)
                                }
                            />
                    </td>

                    <td>
                            <textarea
                                value={row.day}
                                maxLength={30}
                                onChange={(event) =>
                                    updateRowField(index, "day", event.target.value)
                                }
                            />
                    </td>

                    <td>
                            <textarea
                                maxLength={200}
                                style={{
                                    overflowY: "auto",
                                    resize: "vertical",
                                    minHeight: "4em",
                                    width: "100%",
                                }}
                                value={row.unit}
                                onChange={(event) =>
                                    updateRowField(index, "unit", event.target.value)
                                }
                            />
                    </td>

                    <td>
                            <textarea
                                maxLength={200}
                                style={{
                                    overflowY: "auto",
                                    resize: "vertical",
                                    minHeight: "4em",
                                    width: "100%",
                                }}
                                value={row.learningOutcomes}
                                onChange={(event) =>
                                    updateRowField(
                                        index,
                                        "learningOutcomes",
                                        event.target.value
                                    )
                                }
                            />
                    </td>

                    <td>
                            <textarea
                                maxLength={200}
                                style={{
                                    overflowY: "auto",
                                    resize: "vertical",
                                    minHeight: "4em",
                                    width: "100%",
                                }}
                                value={row.readingAssignments}
                                onChange={(event) =>
                                    updateRowField(
                                        index,
                                        "readingAssignments",
                                        event.target.value
                                    )
                                }
                            />
                    </td>

                    <td className="action-btns">
                        <button onClick={() => addRow(index)}>( + )</button>

                        {rows.length > 1 && (
                            <button onClick={() => deleteRow(index)}>
                                ( - )
                            </button>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}