import {updateCourseValues} from "./course/courseService";
// get_table_records
//  - creates nested lists of rows from mytable, returned as 
//      an JSON object with key = mytable.id
//  - mytable -- a table object
//  - ignore_last_two -- if true, last 2 columns are ignored 
//    (used to ignore add/delete buttons)
// currently we filter out any rows that are empty
function get_table_records(mytable, ignore_last_two = false) {
    const rows = [...mytable.getElementsByTagName("tr")];
    const records = rows
        .map(row => {
            const cells = ignore_last_two
                ? [...Array.from(row.cells).slice(0, -2)]
                : [...row.cells];
            return cells.map(cell => cell.innerHTML.trim());
        })
        .filter(row => row.join("") !== "");
    return { [mytable.id]: records };
}

// returns a list of all checked checkboxes from element 'x',
// or returns a string if 'x' has data-type set to "string" 
function get_checkboxes(x) {
    let val = [...x.querySelectorAll('input[type="checkbox"]')]
        .filter(el => el.checked)
        .map(el => el.value);
    if (x.dataset.type === "string") val = val.join("");
    return { [x.id]: val };
}

// ref is a useRef to the relevant component
const saveData = async (ref) => {
    if (!ref.current) {
        console.error("saveData: ref.current is null.");
        return;
    }

    const res_text = [...ref.current.querySelectorAll('input[type="text"]')]
        .map(x => ({ [x.id]: x.value }));
    const res_select = [...ref.current.querySelectorAll("select")]
        .map(x => ({ [x.id]: x.value }));
    const res_list = [...ref.current.querySelectorAll('table[id$="_list"]')]
        .map(x => get_table_records(x, false));
    const res_checkboxes = [...ref.current.querySelectorAll('div[id$="_checkboxes"]')]
        .map(x => get_checkboxes(x));

    const combined = Object.assign({}, ...res_text, ...res_select, ...res_list, ...res_checkboxes);
    console.log("Payload to save:", combined);

    const saved = localStorage.getItem("currentCourseData");
    let course_id = null;
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            course_id = parsed.course_id;
        } catch {
            console.error("Failed to parse currentCourseData");
        }
    }

    if (!course_id) {
        console.error("No course_id found — cannot save.");
        return;
    }

    try {
        await updateCourseValues(course_id, combined);
        console.log(" Data saved successfully via updateCourseValues");
    } catch (error) {
        console.error(" Failed to save data:", error);
        throw error;
    }
};

export default saveData;