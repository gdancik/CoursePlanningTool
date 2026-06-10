import React from "react";
import GeneratePageWrapper from "../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import testPageJson from "../SyllabusView/Data/test-page.json";
import {JsonComponent} from "../../utils/types";

const TestSyllabusPage: React.FC = () => {
    return <GeneratePageWrapper json={testPageJson.content as JsonComponent[]} />;
}

export default TestSyllabusPage;