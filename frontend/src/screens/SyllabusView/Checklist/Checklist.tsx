import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import checklistLayout from "../Data/checklist.json";

const Overview: React.FC = () => {
    return <GeneratePageWrapper json={checklistLayout.content} disableNext = {true} />;
};

export default Overview;
