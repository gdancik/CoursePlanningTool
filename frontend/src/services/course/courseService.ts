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
    course_title: string;
    instructor: string;
    term: string;
    last_edited: string;
    [key: string]: string;
}

const USE_CSV = true;

export const fetchCourses = async(): Promise<Course[]> => {
    if (USE_CSV) {
        const res = await fetch ("/mock_courses.csv");
        const text = await res.text();
        const parsed = Papa.parse<Course> (text, {
            header: true,
            skipEmptyLines: true,
        });
        return parsed.data ;
    }
    else
    {
     const res = await axios.post("/api/getSheet");
     return res.data;
    }
}