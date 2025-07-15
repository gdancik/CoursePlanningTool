export function getCourseField(key) {
  try {
    const data = JSON.parse(localStorage.getItem("newCourseData") || "{}");
    return data[key];
  } catch (error) {
    console.warn("Error reading course data from localStorage:", error);
    return undefined;
  }
}

export function getScheduleFields() {
  return {
    term: getCourseField("term_syllabus") || "Spring",
    year: getCourseField("year_syllabus") || "2026",
    days: getCourseField("days1_syllabus") || "MWF",
  };
}
