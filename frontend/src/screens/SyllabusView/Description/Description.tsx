import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import descriptionPage from "../Data/description-page.json";

const Description: React.FC = () => {
    return <GeneratePageWrapper json={descriptionPage.content} />;
};

export default Description;