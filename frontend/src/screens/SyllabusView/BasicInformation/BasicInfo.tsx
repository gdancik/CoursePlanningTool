import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import basicInfoLayout from "../Data/basic-info.json";
import {JsonComponent} from "../../../utils/types";

const BasicInfo: React.FC = () => {
    return <GeneratePageWrapper json={basicInfoLayout.content as JsonComponent[]} />;
};

export default BasicInfo;
