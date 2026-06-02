import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import learningOutcomesJSON from "../Data/learning-outcomes.json";
import {JsonComponent} from "../../../utils/types";

const LearningOutcomes: React.FC = () => {
    return <GeneratePageWrapper json={learningOutcomesJSON.content as JsonComponent[]} />;
};

export default LearningOutcomes;
