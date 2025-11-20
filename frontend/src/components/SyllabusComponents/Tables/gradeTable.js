import React from "react";
import "./gradeTable.css";

/**
 * @function GradeTable
 * @description The GradeTable component
 * @param props.id - the id of the table element
 * @param props.data - data to load (leave undefined for no data)
 * @details - if props.data is specified, it must be a nested array
 *            with the second element of each row corresponding to 
 *            the grade value. The grade letter is currently fixed.            
 * @returns {html} a grade table with 1 column for letter grades 
 *                 and an editable column for values.
 */
function GradeTable(props) {
  const gradeLetter = [
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "F",
  ];

  let gradeValue = [
      "94-100%",
      "90-93%",
      "86-89%",
      "82-85%",
      "79-81%",
      "75-78%",
      "71-74%",
      "67-70%",
      "62-66%",
      "55-61%",
      "> 55%",
    ];

  // process data
  if (props.data !== undefined) {  
    gradeValue = props.data.map( (x) => x[1]);
    
  }
    
  return (
    <div>
      <h1>Grade Table</h1>
      <table id = {props.id}>
        <tr>
          <th>Grade</th>
          <th>Percentage Interval</th>
        </tr>
        {gradeLetter.map(function (grade, index) {
          return (
            <tr key={index}>
              <td>{grade}</td>
              <td contentEditable="true">{gradeValue[index]}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default GradeTable;
