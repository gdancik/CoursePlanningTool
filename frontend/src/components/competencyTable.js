import React from "react";
import ReactDOM from "react-dom/client";
import "./gradeTable.css";


// generates a table row of td elements for an array of values, or th elements of 'th' is 'true'
function td_row(values, editable = false, th = false) {

  if (th) {
    return (
      <tr>
        {values.map((v, index) => (
          <th key={index} contentEditable={editable}>{v}</th>
        ))}
      </tr>
    );
  } 

  return (
    <tr>
      {values.map((v, index) => (
        <td key={index} contentEditable={editable}>{v}</td>
      ))}
    </tr>
  );
}


// function to create a table with a given id for an array of columns and nested array of rows
// currently columns are not editable but all other rows are
function create_table(id, columns, rows) {
  return (
    <div>
      <table id = {id}>
         {td_row ( columns, false, true ) }
         {rows.map(function(row, index) {
           return (
             td_row(row, true, false)
           )
         })}
         
      </table>
    </div>
  );

}

// generate the first Competency Table
export function CompetencyTable1() {
 
  let columns = ['Knowledge', 'Skill', 'Skill', 'Attitude'];
  let rows = Array.from( {length: 4}, () => 
 		Array.from( {length: 4}, () => "")
	     );
  rows[0][0] = 'Knowledge';
  rows[1][0] = 'Skill';
  rows[2][0] = 'Skill';
  rows[3][0] = 'Attitude';

  return create_table('competency-table1', columns, rows);
}

// generate the second Competency Table
export function CompetencyTable2() {
 
  let columns = ['Competency', 'Outcome'];
  let rows = Array.from( {length: 3}, () => 
 		Array.from( {length: 2}, () => "")
	     );
  rows[0][0] = 'Utilize critical thinking skills to create policy recommendations for criminal justice reform in Connecticut';
  rows[0][1] = (<>
      <i>Recommend</i> criminal justice policy outcomes for the State of Connecticut based on critical analysis of multiple policy solutions
      </>
  );
  
  return create_table('competency-table2', columns, rows);
}
