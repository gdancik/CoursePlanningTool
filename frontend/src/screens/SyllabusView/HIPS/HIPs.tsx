import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import hipsJSON from "../Data/hips.json";

const HIPS: React.FC = () => {
    return <GeneratePageWrapper json={hipsJSON.content} />;
};

export default HIPS;
