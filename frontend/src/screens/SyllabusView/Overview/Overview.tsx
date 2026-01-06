import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import overviewLayout from "../Data/overview.json";

const Overview: React.FC = () => {
    return <GeneratePageWrapper json={overviewLayout.content} disableBack = {true} />;
};

export default Overview;
