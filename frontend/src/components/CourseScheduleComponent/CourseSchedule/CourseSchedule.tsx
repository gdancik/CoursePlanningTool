import React from "react";

import "../../SyllabusComponents/Tables/gradeTable.css";
import "../../Button/ReusableButton.css";

import type { CourseScheduleProps} from "../types/courseScheduleTypes";
import { useCourseSchedule } from "./useCourseSchedule";
import { CourseScheduleToolbar} from "./CourseScheduleToolbar";
import { CourseScheduleTable } from "./CourseScheduleTable";

function CourseSchedule({
                            id,
                            term,
                            year,
                            days,
                            data,
                        }: CourseScheduleProps) {
    const schedule = useCourseSchedule({
        term,
        year,
        days,
        data,
    });

    return (
        <div>
            <CourseScheduleToolbar
                missingScheduleInformation={schedule.missingScheduleInformation}
                normalizedTerm={schedule.normalizedTerm}
                normalizedYear={schedule.normalizedYear}
                normalizedDays={schedule.normalizedDays}
                isGeneratingSchedule={schedule.isGeneratingSchedule}
                dateFormat={schedule.dateFormat}
                datesSorted={schedule.datesSorted}
                generateSchedule={schedule.generateSchedule}
                clearSchedule={schedule.clearSchedule}
                sortScheduleByDate={schedule.sortScheduleByDate}
                changeDateFormat={schedule.changeDateFormat}
            />

            <CourseScheduleTable
                id={id}
                rows={schedule.scheduleRows}
                addRow={schedule.addRow}
                deleteRow={schedule.deleteRow}
                updateDateField={schedule.updateDateField}
                normalizeDateField={schedule.normalizeDateField}
                updateRowField={schedule.updateRowField}
            />
        </div>
    );
}

export default CourseSchedule;