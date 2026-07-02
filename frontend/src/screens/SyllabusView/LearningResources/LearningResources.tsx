import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import learningResourcesPage from "../Data/learning-resources.json";
import {JsonComponent} from "../../../utils/PageRenderEngine/types";
const LearningResources: React.FC = () => {
    return <GeneratePageWrapper json={learningResourcesPage.content as JsonComponent[]}/>;
};

export default LearningResources;