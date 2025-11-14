import { createNewCourse
 } from "../../services/course/courseService";
 import saveData from "../../services/processData";

export async function saveAndExitHandler({
  formData,
  containerRef,
  modal,
  navigate,
}: {
  formData: Record<string, string>,
  containerRef: React.RefObject<HTMLDivElement>,
  modal: any,
  navigate: (path: string) => void,
}) {
  modal.showRedirect("Saving & Exiting", "Hold on, we're saving and redirecting you...", "loading");

  let course_id = formData["course_id"] || localStorage.getItem("currentCourseId");
  let dataToSave = { ...formData };

  if (!course_id) {
    const result = await createNewCourse(dataToSave);
    if (!result?.course_id) {
      modal.showError("Failed to create course");
      setTimeout(() => modal.hide(), 2500);
      return;
    }
    course_id = result.course_id;
    dataToSave["course_id"] = course_id;
    localStorage.setItem("currentCourseId", course_id);
  }
  localStorage.setItem("currentCourseId", course_id);
  localStorage.setItem("currentCourseData", JSON.stringify({ ...dataToSave, course_id }));

  try {
    await saveData(containerRef);
    modal.showRedirect("Saved & Exiting", "Redirecting you to My Courses Home Page...", "success");
    setTimeout(() => {
      modal.hide();
      navigate("/course-page");
    }, 1500);
  } catch (err: any) {
    modal.showError(err?.message || "An unexpected error occurred.");
    setTimeout(() => modal.hide(), 2500);
  }
}