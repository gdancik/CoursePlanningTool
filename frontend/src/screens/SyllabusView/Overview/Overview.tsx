import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import overviewLayout from "../Data/overview.json";
import {JsonComponent} from "../../../utils/PageRenderEngine/types";

const Overview: React.FC = () => {
    return <GeneratePageWrapper json={overviewLayout.content as JsonComponent[]} disableBack = {true} />;
};

export default Overview;
