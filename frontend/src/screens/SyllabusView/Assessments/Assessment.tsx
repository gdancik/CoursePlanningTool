import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import assessmentLayout from "../Data/assessment.json";

const Assessment: React.FC = () => {
    return <GeneratePageWrapper json={assessmentLayout.content} />;
};

export default Assessment;