import fs from 'fs';

/******************************************************
 * This checks whether all ids in syllabus page json 
 * files are valid (i.e., listed in 
 * https://gdancik.pythonanywhere.com/api/valid_inputs).
 * 
 * This script should be run from directory containing
 * json files (or using npm run check_ids from any 
 * directory in the project)
 *******************************************************/

// iterates through all ids for json content and adds
// to error_ids array if not found in valid_ids
function check_ids(content_list, valid_ids, error_ids) {
    //console.log("in check ids");
    //console.log(valid_ids);
    if (!Array.isArray(content_list)) {
        throw new Error ('content_list is not an array');
    }
    for (let component of content_list) {        
        if ('id' in component) {
            let id = component['id'];
            //console.log('checking ' + id);
            if (valid_ids.includes(id)) {
                //console.log(component['id'] + ' -- VALID');
            } else {
                //console.log(component['id'] + ' -- ERROR');
                error_ids.push(component['id'])
            }
        }
        if ('content' in component) {
            check_ids(component['content'], valid_ids, error_ids);
        }
    }
}

// Get the valid ids
fetch('https://gdancik.pythonanywhere.com/api/valid_inputs/')
  .then(response => {
    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the JSON from the response
  })
  .then(data => {

    // create array of valid ids
    let valid_ids = []
    for (let page in data) {
        valid_ids.push(...data[page])
    }

    //console.log(valid_ids);

    // get all json files
    let json_files = fs.readdirSync('.').filter(
        (f) => {
            const fileExtensionFilter = /\.json$/;
            return fileExtensionFilter.test(f);
        }
    )
    
    // check ids from each file
    for (let f of json_files) {
        console.log('checking file: '+ f + '...');
        const json = JSON.parse(fs.readFileSync(f, 'utf8'));
        //console.log(basic_info);
        //console.log('passing valid ids:')
        //console.log(valid_ids);
        let error_ids = [];
        check_ids(json['content'], valid_ids, error_ids);

        if (error_ids.length > 0) {
            console.log(f + ' errors:')
            error_ids.forEach( (x) => console.log('  ' + x));
        }
        console.log();
    }

  })
  .catch(error => {
    console.error('Error fetching valid_inputs:', error);
  });
