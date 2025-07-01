///Old Code could still be use
// TEMP: Bypass CORS for testing only
//const proxy = "https://cors-anywhere.herokuapp.com/";
//onst BASE_URL = proxy + "https://gdancik.pythonanywhere.com/api";

// Get all courses from a given sheet (ex: 'annie')
//export const getCoursesFromSheet = async (sheetName: string) => {
//   const response = await axios.post(`${BASE_URL}/getSheet`, {
//       sheet_name: sheetName,
//   });
///   return response.data;
//};

// Create a new course
///export const createNewCourse = async () => {
 //   const response = await axios.post(`${BASE_URL}/createNewCourse`);
 //   return response.data;
//};


import Papa from "papaparse";
import axios from "axios";

export interface Course {
    course_id: string;
    course_title_syllabus: string;
    instructor_name_syllabus: string;
    term_syllabus: string;
    last_edited: string;
    [key: string]: string;
}
const USE_CSV = false;
const proxy = "https://cors-anywhere.herokuapp.com/";
const BASE_URL = proxy + "https://gdancik.pythonanywhere.com/api";



export const fetchCourses = async (): Promise<Course[]> => {
    if (USE_CSV) {
        const res = await fetch("/data/mock_courses.csv");
        const text = await res.text();
        const parsed = Papa.parse<Course>(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });

        // Filter out empty rows or rows missing course_id
        return parsed.data.filter((row) => row.course_id?.trim());
    } else {
        const res = await axios.post(`${BASE_URL}/getSheet`, {}, { withCredentials: true });
        return res.data;
    }
};