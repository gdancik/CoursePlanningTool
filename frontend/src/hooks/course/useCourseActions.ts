import type {ModalFactory} from "../../utils/useModalFactory";
import {EditCourseActions} from "./useEditCourseAction";
import {usePreviewCourseAction} from "./usePreviewCourseAction";
import {useDeleteCourseAction} from "./useDeleteCourseAction";
import {useDuplicateCourseAction} from "./useDuplicateCourseAction";
import {useCreateCourseAction} from "./useCreateCourseAction";
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
    const {duplicateCourse} = useDuplicateCourseAction({userEmail, modal})
    const {createCourse } = useCreateCourseAction({userEmail, modal});

    return{ editCourse, previewCourse, deleteCourse, duplicateCourse, createCourse};
}