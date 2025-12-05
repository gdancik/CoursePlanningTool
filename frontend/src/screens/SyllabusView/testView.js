import React from "react";
import { useRef } from "react";
import saveData from "../../services/processData.js"

function TestView(props) {
  
  const ref = useRef(null);

  // needed to get inputs from only this component
  const containerRef = useRef(null);

  const gradeData = [
    ['a',"97+"],
    ['b',"80 - 90"],
    ['c',3]
  ];

  return (
    <div ref = {containerRef}>

  <input type = "text" id = "txt1" defaultValue = "textbox 1"></input>
  <input type = "text" id = "txt2" defaultvalue = "textbox 2"></input>

&nbsp;&nbsp;&nbsp;

   <label for="cars">Choose a car:</label>

  <select name="cars" id="cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
  </select> 
    
<br/><br/>

<div id = 'meeting_days_checkboxes' data-type = 'string'>
  <label>Meeting Days</label>
  <div>
    {['M','T','W','R','F'].map(
      (x) => <label><input type="checkbox" value={x}></input>{x}</label>
    )}
  </div>
</div>
   <br/>
   <hr/>


    
   <button onClick = {() => saveData(containerRef)}>Save</button>
   </div>
  );
}

export default TestView;
