import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import basicInfoLayout from "../Data/basic-info.json";

const BasicInfo: React.FC = () => {
    return <GeneratePageWrapper json={basicInfoLayout.content} />;
};

export default BasicInfo;
