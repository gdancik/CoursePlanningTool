import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import checklistLayout from "../Data/checklist.json";
import {JsonComponent} from "../../../utils/types";

const Overview: React.FC = () => {
    return <GeneratePageWrapper json={checklistLayout.content as JsonComponent[]} disableNext = {true} />;
};

export default Overview;
