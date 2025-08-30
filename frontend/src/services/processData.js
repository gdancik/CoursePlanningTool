
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

// returns a list of all checked checkboxes from element 'x',
// or returns a string if 'x' has data-type set to "string" 
function get_checkboxes(x) {
        let res = {};
        let val = [...x.querySelectorAll('input[type="checkbox"]')].filter((x)=>x.checked).map(
          y => y.value
        );
        if (x.dataset.type == "string") {
          val = val.join('');
        }
        res[x.id] = val;
        return res;
}

// ref is a useRef to the relevant component
const saveData = async(ref) => {

   // we process the following:
   //    - input[type = "text"] -- saves text
   //    - select -- saves the selected value
   //    - table[id$="_list"] -- saves table as a nested list
   //    - div[id$="_checkboxes"] -- saves a list of all checked values, or a string
   //                 if data-type = "string"
      
    // process plain text
    let res_text = 
        [... ref.current.querySelectorAll('input[type = "text"]')].map(
          x => {
            let res = {};
            res[x.id] = x.value;
            return res;
         }
    );
  
    // process dropdowns
    let res_select = 
        [... ref.current.querySelectorAll('select')].map(
          x => {
            let res = {};
            res[x.id] = x.value;
            return res;
         }
    );


    // process tables as nested lists
    let res_list = [...ref.current.querySelectorAll('table[id$="_list"]')].map(
      // TO DO: we can check x.dataset.ignore_last_two to ignore the last two columns
      x => get_table_records(x,false)   
    );

    // process tables as nested lists
    let res_checkboxes = [...ref.current.querySelectorAll('div[id$="_checkboxes"]')].map(
      x => get_checkboxes(x)      
    );

    // TO DO: values ending in '_json' need to be handled; are there others?

    let result = []
    result.push(...res_text);  
    result.push(...res_select)
    result.push(...res_list);
    result.push(...res_checkboxes);

    alert(JSON.stringify(result));

    // now send val to updateValue API endpoint            
    
    }

export default saveData;