/**
 * This file contains utility functions for:
 * - Navigating between pages using the `react-router-dom` `navigate` function
 * - Handling back/next page logic
 * - Preview functionality (currently logs to console)
 * - Saving form data as a downloadable JSON file
 */

import { NavigateFunction } from "react-router-dom";

// Ordered list of page routes for navigation
const pageOrder = [
    "/overview",
    "/basic-info",
    "/course-description",
    "/learning-outcomes",
    "/hips",
    "/learning-resources",
    "/assessment",
    "/course-schedule",
    "/checklist"
];

/**
 * Navigates to the previous page in `pageOrder` based on the current path.
 */

function saveCurrentFormToLocalStorage (formData: Record<string, string>, courseId?: string){
    try{
        const existingData = localStorage.getItem("currentCourseData");
        const parsed = existingData ? JSON.parse(existingData) : {};

        const  merged = {
            ...parsed,
        ...formData,
        ...(courseId ? { course_id: courseId } : {})
        };
        localStorage.setItem("currentCourseData", JSON.stringify(merged));
    } catch (err) {
        console.error("Failed to save form data:", err);
    }
}

export const handleBack = (
    navigate: NavigateFunction,
    currentPath: string,
    formData: Record<string, string>,
    courseID?: string
) => {

    saveCurrentFormToLocalStorage(formData, courseID);



    const index = pageOrder.indexOf(currentPath); // Find the index of the current page
    if (index > 0) {
        navigate(pageOrder[index - 1]); // Navigate to the previous page
    } else {
        console.log("No previous page"); // No previous page (already at first)
    }
};

/**
 * Navigates to the next page in `pageOrder` based on the current path.
 */
export const handleNext = (
    navigate: NavigateFunction,
    currentPath: string,
    formData: Record<string, string>,
    courseID?: string
) => {
    //console.log("Current Path:", currentPath);
    const index = pageOrder.indexOf(currentPath); // Find the index of the current page
    //console.log("Current index:", index);

    if (index >= 0 && index < pageOrder.length - 1) {
        const nextPage = pageOrder[index + 1]; // Determine the next page
        //console.log("Navigating to:", nextPage);
        navigate(nextPage); // Navigate to the next page
    } else {
        //console.log("No next page found"); // No next page (already at last)
    }
};




/**
 * Handles preview logic. Currently just logs to the console.
 */

//TODO: Preview

/**
 * Saves the provided data as a JSON file for download.
 * @param data - The data to be saved
 * @param fileName - The name of the downloaded JSON file
 */
export function saveJsonFile(data: Record<string, string>, fileName: string) {
    // Create a Blob containing the JSON data

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(jsonBlob); // Create a URL for the Blob

    // Create an anchor element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);
}
