import React from "react";
import { useRef } from "react";
import GradeTable from "../../components/Tables/gradeTable.js"
import saveData from "../../services/processData.js"

function TestView(props) {
  
  const ref = useRef(null);

  // needed to get inputs from only this component
  const containerRef = useRef(null);

  return (
    <div ref = {containerRef}>

  <input type = "text" id = "txt1" value = "textbox 1"></input>
  <input type = "text" id = "txt2" value = "textbox 2"></input>
    
   <GradeTable id = 'grade_table_syllabus_list'></GradeTable>
    <br/>
   <button onClick = {() => saveData(containerRef)}>Save</button>
   </div>
  );
}

export default TestView;
