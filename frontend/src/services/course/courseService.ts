import axios from "axios";

// TEMP: Bypass CORS for testing only
const proxy = "https://cors-anywhere.herokuapp.com/";
const BASE_URL = proxy + "https://gdancik.pythonanywhere.com/api";

// Get all courses from a given sheet (ex: 'annie')
export const getCoursesFromSheet = async (sheetName: string) => {
    const response = await axios.post(`${BASE_URL}/getSheet`, {
        sheet_name: sheetName,
    });
    return response.data;
};

// Create a new course
export const createNewCourse = async () => {
    const response = await axios.post(`${BASE_URL}/createNewCourse`);
    return response.data;
};