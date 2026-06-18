import type {ModalFactory} from "../../utils/useModalFactory";
import {EditCourseActions} from "./useEditCourseAction";
import {usePreviewCourseAction} from "./usePreviewCourseAction";
import {useDeleteCourseAction} from "./useDeleteCourseAction";
interface useCourseActionsParameters {
    userEmail?: string,
    modal: ModalFactory;
}

export const useCourseActions = ({
    userEmail, modal,
}: useCourseActionsParameters) => {
    const { editCourse } = EditCourseActions({userEmail, modal});
    const {previewCourse} =  usePreviewCourseAction({modal,})
    const {deleteCourse} = useDeleteCourseAction({userEmail, modal});

    return{ editCourse, previewCourse, deleteCourse};
}