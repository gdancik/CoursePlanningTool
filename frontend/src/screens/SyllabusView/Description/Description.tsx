import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import descriptionPage from "../Data/description-page.json";
import {JsonComponent} from "../../../utils/PageRenderEngine/types";

const Description: React.FC = () => {
    return <GeneratePageWrapper json={descriptionPage.content as JsonComponent[]} />;
};

export default Description;