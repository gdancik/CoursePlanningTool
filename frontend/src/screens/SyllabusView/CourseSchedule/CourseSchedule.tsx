import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import courseScheduleLayout from "../Data/course-schedule.json";
import {JsonComponent} from "../../../utils/types";

const CourseSchedulePage: React.FC = () => {
    return <GeneratePageWrapper json={courseScheduleLayout.content as JsonComponent[]} />;
};

export default CourseSchedulePage;
