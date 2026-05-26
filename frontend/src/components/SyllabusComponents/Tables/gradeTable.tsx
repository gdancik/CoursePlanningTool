import React from "react";
import "./gradeTable.css";

export interface GradeTableProps {
    id: string;
    data?: [string, string][];    
}


const GradeTable: React.FC<GradeTableProps> = ({ id, data }) => {

    const gradeLetters = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

    const defaultIntervals = [
        "94-100%",
        "90-93%",
        "87-89%",
        "83-86%",
        "80-82%",
        "77-79%",
        "73-76%",
        "70-72%",
        "67-69%",        
        "60-66%",
        "<60%",
    ];


    const [intervals, setIntervals] = React.useState<string[]>(defaultIntervals);
    const [rows, setRows] = React.useState<[string, string][]>([["",""]]);

    const handleChange = (index: number, value: string) => {
      const updated = [...intervals];      
      updated[index] = value;
      //alert("setting intervals: " + updated);
      setIntervals(updated);          
     
    };

     // handle updates to data
    React.useEffect(() => {              
      const r: [string, string][] = gradeLetters.map((letter, i) => {        
        return [letter, intervals[i]];
      });            
      
      setRows(r);

      }, [intervals]);

    // handle updates to data
    React.useEffect(() => {        
          
      const r: [string, string][] = gradeLetters.map((letter, i) => {
        if(data && data[i] && data[i][0]){
            return [letter, data[i+1][1]];
        }
        return [letter, intervals[i]];
      });
      
      setRows(r);

      }, [data]);

         
  return (
    <div className="grade-table-wrapper">
      {/*<h2 className="grade-table-title">Grade Table</h2>*/}

      <table id={id} className="grade-table">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Percentage Interval</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(([letter, interval], idx) => (
            <tr key={idx}>
              <td>{letter}</td>              
                <td>                              
                    <textarea                  
                      value={interval}                       
                      onChange={(e) => {                        
                        handleChange(idx, e.target.value)                      
                      }}                                                    
                    />                                 
              </td>              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default GradeTable;