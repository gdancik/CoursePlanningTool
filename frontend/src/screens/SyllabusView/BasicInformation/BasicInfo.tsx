import React from "react";
import SyllabusPageWrapper from "../../../components/SyllabusComponents/SyllabusPageWrapper";

const BasicInfo:React.FC = () => {
    return (
        <SyllabusPageWrapper
            csvPath="data/basic_info_fields.csv"
            title="Basic Information"
        />
    );
};

export default BasicInfo;