import React from "react";
import GeneratePageWrapper from "../../components/SyllabusComponents/SyllabusPageComponents/GeneratePageWrapper";
import testPageJson from "../SyllabusView/Data/test-page.json";

const TestSyllabusPage: React.FC = () => {
    return <GeneratePageWrapper json={testPageJson.content} />;
}

export default TestSyllabusPage;