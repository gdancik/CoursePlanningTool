import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/GeneratePageWrapper";
import basicInfoLayout from "../Data/basic-info-test.json";

const BasicInfo: React.FC = () => {
    return <GeneratePageWrapper json={basicInfoLayout.content} />;
};

export default BasicInfo;
