import React from "react";
import CourseSchedule from "../../CourseScheduleComponent/CourseSchedule/CourseSchedule";

import {CourseScheduleComponent, FormState} from "../../../utils/PageRenderEngine/types";

interface PropsForCourseSchedule {
    component: CourseScheduleComponent;
    formData: FormState;
}

export const CourseScheduleWrapper: React.FC<PropsForCourseSchedule> = ({
    component, formData,
})=> {
    const meetingDays = formData[component.days1];
    const secondaryMeetingDays = component.days2 ? formData[component.days2] : undefined
    const term = formData[component.term];
    const year = formData[component.year]

    let daysValue = [ Array.isArray (meetingDays) ? meetingDays.join(""): meetingDays ?? "",
        Array.isArray (secondaryMeetingDays) ? secondaryMeetingDays.join(""): secondaryMeetingDays ?? ""
    ]
        .map(String)
        .join("");
    return(<CourseSchedule
            id={component.id}
            term={term}
            year={year}
            days={daysValue}
            data={formData[component.id]}
        />
    );
}