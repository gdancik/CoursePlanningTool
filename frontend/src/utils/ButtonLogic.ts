/**
 *
 * Function for button logic and to download a JSON form the given data
 */
import { NavigateFunction } from "react-router-dom";

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

export const handleBack = (navigate: NavigateFunction, currentPath: string) => {
    const index = pageOrder.indexOf(currentPath);
    if (index > 0) {
        navigate(pageOrder[index - 1]);
    } else {
        console.log("No previous page");
    }
};

export const handleNext = (navigate: NavigateFunction, currentPath: string) => {
    console.log("Current Path:", currentPath);
    const index = pageOrder.indexOf(currentPath);
    console.log("Current index:", index);

    if (index >= 0 && index < pageOrder.length - 1) {
        const nextPage = pageOrder[index + 1];
        console.log("Navigating to:", nextPage);
        navigate(nextPage);
    } else {
        console.log("No next page found");
    }
};

export const handlePreview = () => {
    console.log("Preview clicked!");
};

export function saveJsonFile(data: Record<string, string>, fileName: string) {
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(jsonBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
}