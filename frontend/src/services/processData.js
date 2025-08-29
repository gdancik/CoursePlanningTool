
// get_table_records
//  - creates nested lists of rows from mytable, returned as 
//      an JSON object with key = mytable.id
//  - mytable -- a table object
//  - ignore_last_two -- if true, last 2 columns are ignored 
//    (used to ignore add/delete buttons)
// currently we filter out any rows that are empty
function get_table_records(mytable, ignore_last_two = false) {
  
    if (ignore_last_two) {
      var records = [...mytable.getElementsByTagName('tr')].map(
        row => [...Array.from(row.cells).slice(0,-2)].map(cell => cell.innerHTML.trim())
      );
    } else {
      var records = [...mytable.getElementsByTagName('tr')].map(
        row => [...row.cells].map(cell => cell.innerHTML.trim())
      );
    } 

    records = records.filter(row => row.join('') != '');

    let result = {};
    result[mytable.id] = records;

    return result;
};


// ref is a useRef to the relevant component
const saveData = async(ref) => {

   // we assume ids end with either:
   //    - list -- use get_table_records()
   //    - json -- TO DO -- not clear yet how to handle this
   //    - everything else --  extract value
      
    // process plain text
    let res_text = 
        [... ref.current.querySelectorAll('input:not([id$="_list"]):not([id$="_json"])')].map(
          x => {
            let res = {};
            res[x.id] = x.value;
            return res;
         }
    );
  
    // process tables as nested lists
    let res_list = [... ref.current.querySelectorAll('table[id$="_list"]')].map(
      // TO DO need to set true/false appropriately
      x => get_table_records(x,false)   
    );

    // TO DO: values ending in '_json' need to be handled; are there others?

    let result = []
    if (res_text.length > 0) {
      result.push(res_text);
    }

    if (res_list.length > 0) {
      result.push(res_list);
    }

    alert(JSON.stringify(result));

    // now send val to updateValue API endpoint            
    
    }

export default saveData;