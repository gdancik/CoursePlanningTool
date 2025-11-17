import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import courseScheduleLayout from "../Data/course-schedule.json";

const CourseSchedulePage: React.FC = () => {
    return <GeneratePageWrapper json={courseScheduleLayout.content} />;        
};

export default CourseSchedulePage;
