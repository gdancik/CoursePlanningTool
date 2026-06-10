import React from "react";
import GeneratePageWrapper from "../../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import assessmentLayout from "../Data/assessment.json";
import {JsonComponent} from "../../../utils/types";

const Assessment: React.FC = () => {
    return <GeneratePageWrapper json={assessmentLayout.content as JsonComponent[]} />;
};

export default Assessment;