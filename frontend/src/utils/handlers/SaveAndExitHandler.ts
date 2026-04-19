import { createNewCourse
 } from "../../services/course/courseService";
 import saveData from "../../services/processData";
import {FormState} from "../types";

export async function saveAndExitHandler({
  formData,
  containerRef,
  modal,
  navigate,
  navigate_to = '/course-page',
}: {
  formData: FormState,
  containerRef: React.RefObject<HTMLDivElement>,
  modal: any,
  navigate: (path: string) => void,
  navigate_to?: string
}) {

  
  //modal.showRedirect("Saving & Exiting", "Hold on, we're saving and redirecting you...", "loading");
  const existingCourseId =
      typeof formData["course_id"] === "string"
          ? formData["course_id"]
          : localStorage.getItem("currentCourseId");

  let course_id: string = existingCourseId ?? "";
  //alert('save and exit ==>' + navigate_to + "with course id " +course_id);
  
  //let rr = true;
  //if (rr) {
  //  return;
  //}
  

  
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
    if (navigate_to == '/course-page') {      
      modal.showRedirect("Saved & Exiting", "Redirecting you to My Courses Page...", "success");
    } else {
      modal.showRedirect("Saved & Exiting", "Exiting Course Planning Tool...", "success");
    }
    setTimeout(() => {
      modal.hide();
      //alert('navigate NOW to ' + navigate_to);
      navigate(navigate_to);
    }, 1500);
  } catch (err: any) {
    modal.showError(err?.message || "An unexpected error occurred.");
    setTimeout(() => modal.hide(), 2500);
  }
}