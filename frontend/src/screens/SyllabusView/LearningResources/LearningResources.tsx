import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import learningResourcesPage from "../Data/learning-resources.json";
const LearningResources: React.FC = () => {
    return <GeneratePageWrapper json={learningResourcesPage.content}/>;
};

export default LearningResources;