import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import learningOutcomesJSON from "../Data/learning-outcomes.json";

const LearningOutcomes: React.FC = () => {
    return <GeneratePageWrapper json={learningOutcomesJSON.content} />;
};

export default LearningOutcomes;
