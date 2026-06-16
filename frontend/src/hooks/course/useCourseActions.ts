import type {ModalFactory} from "../../utils/useModalFactory";
import {EditCourseActions} from "./useEditCourseAction";

interface useCourseActionsParameters {
    userEmail?: string,
    modal: ModalFactory;
}

export const useCourseActions = ({
    userEmail, modal,
}: useCourseActionsParameters) => {
    const { editCourse } = EditCourseActions({userEmail, modal});

    return{ editCourse, };
}