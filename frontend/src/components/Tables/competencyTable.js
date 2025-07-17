import React from "react";
import {ReactDOM, createRoot} from "react-dom/client";
import "./gradeTable.css";


// Generates a collection of td/th elements for an array of values
// each row will include an add/delete button (header row includes add button only)
// max_n is the maximum number of rows in the table
// editable -- true to make non-header cells editable
// th -- true for a th group instead of a td group
function td_group(values, editable = false, th = false, max_n = null) {

  let n = values.length;

  if (th) {
    return (
      <>
        {values.map((v, index) => (         
          <th key={index} contentEditable={editable}>{v}</th>
        ))}        
      <td><button onClick={(e) => addRow(e,n, max_n)}>+</button></td>
      <td></td>
      </>
    );
  } 

  return (
    <>
      {values.map((v, index) => (
        <td key={index + '_' + new Date().getTime()} style = {{height: "33.3px"}} contentEditable={editable}
           onInput = {limitInput}>{v}</td>
      ))}
      <td><button onClick={(e) => addRow(e,n, max_n)}>+</button></td>
      <td><button onClick={deleteGrandparent}>X</button></td>
    </>
  );
}


// generates a row of td/th elements
function td_row(values, editable = false, th = false, max_n = null) {
    return (
      <tr>
        {td_group(values, editable, th, max_n)}
      </tr>
    )
}


// function to create a table with a given id for an array of columns and nested array of rows
// currently columns are not editable but all other rows are
// max_n determines the maximum number of rows in the table
function create_table(id, columns, rows, max_n = null) {
  return (
    <div style = {{marginRight: "20px"}}>
      <table id = {id} style = {{width: "100%"}}>
        <tbody>
         {td_row ( columns, false, true, max_n ) }
         {rows.map(function(row, index) {
           return (
             td_row(row, true, false, max_n)
           )
         })}
         </tbody>
      </table>
    </div>
  );

}

// deletes the grandparent element -- used for delete button whose grandparent is the table row
function deleteGrandparent(event) {
  let btn = event.currentTarget;
  btn.parentElement.parentElement.remove();
}

function limitInput(event) {
  let max_characters = 200;
  let el = event.currentTarget;
  if (el.innerText.length > max_characters) {
    el.innerText = el.innerText.slice(0,max_characters)
    alert('You have reached the character limit for this cell (' + max_characters + ') characters)');
  }
  
}

function addRow(event, n, max_n = null) {
  let btn = event.currentTarget;
  let current_tr = btn.parentElement.parentElement;

  let tr = current_tr.nextSibling;


  if (tr == null) {
    // we are at the last row, so we need to add one
    current_tr.parentElement.appendChild(document.createElement('tr'));
    tr = current_tr.nextSibling;
  }

  // console.log("length = " + tr.parentElement.getElementsByTagName('tr').length + ", " +max_n);

  if (max_n && tr.parentElement.getElementsByTagName('tr').length >= max_n) {
    alert('You have reached the maximum size for this table');   
    return; 
  }

  let vals = Array.from( {length: n}, () => "")

  const container = document.createElement('tr');
  tr.parentElement.insertBefore(container, tr);

  const root = createRoot(container);
  root.render(td_group(vals, true, false, max_n));

}


// generate the first Competency Table
export function CompetencyTable1() {
 
  let columns = ['Knowledge', 'Skill', 'Skill', 'Attitude'];
  let rows = Array.from( {length: 4}, () => 
 		Array.from( {length: 4}, () => " ")
	     );
  rows[0][0] = 'Knowledge';
  rows[1][0] = 'Skill';
  rows[2][0] = 'Skill';
  rows[3][0] = 'Attitude';

  return create_table('competency-table1', columns, rows, 6);
}
export default CompetencyTable2;

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
  
  return create_table('competency-table2', columns, rows, 6);
}
