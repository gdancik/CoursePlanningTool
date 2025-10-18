import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import descriptionPage from "../Data/description.json";

const Description: React.FC = () => {
    return <GeneratePageWrapper json={descriptionPage.content} />;
};

export default Description;