import React, { useState } from "react";
import TestView from "./SyllabusView/testView.js"

const TestPage2: React.FC = () => {

    return (
        <div style={{ padding: "2rem" }}>
            <h1>TestView</h1>
            <TestView></TestView>
        
        <br/>
          <input type = "text" id = "txt_skip" value = "This should be ignored"></input>
        </div>
    );
};

export default TestPage2;
