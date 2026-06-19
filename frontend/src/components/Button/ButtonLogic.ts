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
    "/checklist",
];

const getPagePath = (currentPath: string): string => {
    return pageOrder.find((page) => currentPath.endsWith(page)) ?? currentPath;
};

const buildCourseRoute = (pagePath: string, courseId?: string): string => {
    if (!courseId) return pagePath;

    return `/courses/${courseId}${pagePath}`;
};

export const handleBack = (
    navigate: NavigateFunction,
    currentPath: string,
    courseId?: string
) => {
    const currentPagePath = getPagePath(currentPath);
    const index = pageOrder.indexOf(currentPagePath);

    if (index > 0) {
        const previousPage = pageOrder[index - 1];
        navigate(buildCourseRoute(previousPage, courseId));
    }
};

export const handleNext = (
    navigate: NavigateFunction,
    currentPath: string,
    courseId?: string
) => {
    const currentPagePath = getPagePath(currentPath);
    const index = pageOrder.indexOf(currentPagePath);

    if (index >= 0 && index < pageOrder.length - 1) {
        const nextPage = pageOrder[index + 1];
        navigate(buildCourseRoute(nextPage, courseId));
    }
};