import {previewSyllabus} from "../../services/course/courseAPI";
import type {ModalFactory} from "../../utils/useModalFactory";

//Download Syllabus Helper

const downloadSyllabusPreview = (
    blob: Blob,
    courseId: string
)=> {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `syllabus_preview_${courseId}.docx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
}

//Use Preview action
interface usePreviewCourseActionParameters {
    modal: ModalFactory;
}

export const usePreviewCourseAction = ({
    modal,
}: usePreviewCourseActionParameters) => {
    const previewCourse =  async ( courseId: string, courseTitle: string) => {
        modal.showRedirect ( "Generating Preview" , `Downloading syllabus for "${courseTitle}". `, "loading");

        try {
            const blob  = await previewSyllabus(courseId);

            if (!blob) {throw new Error("Empty preview response")};

            downloadSyllabusPreview(blob, courseId);
            modal.showRedirect(
                "Preview Ready!",
                `Downloaded "${courseTitle}".`,
                "success"
            );
            setTimeout(() => {
                modal.hide();
            }, 3000);

        } catch (err: unknown) {
            console.error("Preview failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : `Could not download "${courseTitle}".`;

            modal.showError(message);
        }
    };
    return {previewCourse,}
}