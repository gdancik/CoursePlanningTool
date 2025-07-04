
// creates a nested array with rows from a table
// last 2 columns are ignored if ignore_lsat_two is true
// currently we filter out any rows that are empty
function get_table_records(id, ignore_last_two = false) {
    let mytable = document.getElementById(id);

    if (ignore_last_two) {
      var records = [...mytable.getElementsByTagName('tr')].map(
        row => [...Array.from(row.cells).slice(0,-2)].map(cell => cell.innerHTML.trim())
      );
    } else {
      var records = [...mytable.getElementsByTagName('tr')].map(
        row => [...row.cells].map(cell => cell.innerHTML.trim())
      );
    } 

    return records.filter(row => row.join('') != '')
};


