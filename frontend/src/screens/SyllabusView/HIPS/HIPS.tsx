import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import hipsJSON from "../Data/hips.json";
import {JsonComponent} from "../../../utils/types";

const HIPS: React.FC = () => {
    return <GeneratePageWrapper json={hipsJSON.content as JsonComponent[]} />;
};

export default HIPS;
