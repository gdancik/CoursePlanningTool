import type {ModalFactory} from "../../utils/useModalFactory";
import {EditCourseActions} from "./useEditCourseAction";
import {usePreviewCourseAction} from "./usePreviewCourseAction";
interface useCourseActionsParameters {
    userEmail?: string,
    modal: ModalFactory;
}

export const useCourseActions = ({
    userEmail, modal,
}: useCourseActionsParameters) => {
    const { editCourse } = EditCourseActions({userEmail, modal});
    const {previewCourse} =  usePreviewCourseAction({modal,})

    return{ editCourse, previewCourse};
}