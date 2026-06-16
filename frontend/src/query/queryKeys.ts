export const queryKeys = {
    courses: (userEmail: string ) =>
        ["courses", userEmail] as const,

    course: (courseId: string) =>
        ["courses", courseId] as const,

    currentCourseId: (userEmail: string) =>
        ["courses", userEmail] as const,
};