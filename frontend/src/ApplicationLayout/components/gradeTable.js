import React from "react";
import "./gradeTable.css";

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

  const gradeValue = [
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
