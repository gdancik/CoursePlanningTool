import React from "react";
import RedirectingModal from "./RedirectingModal/RedirectingModal";
import ErrorModal from "./ErrorModal/ErrorModal";
import CourseModal from "../CourseModal/NewCourseModal";
import CustomModal from "./CustomModal/CustomModal";

import StudentCommunicationTipsModal from "./SyllabusModals/StudentCommunicationTipsModal";
import type { ModalFactory } from "../../utils/useModalFactory";
import {FormState} from "../../utils/PageRenderEngine/types";

const CUSTOM_MODAL_COMPONENTS: Record<string, React.FC<any>> = {
  StudentCommunicationTips: StudentCommunicationTipsModal,
};

interface ModalRendererProps {
  modal: ModalFactory;
  onCourseCreate?: (data: FormState) => Promise<void>;
}

const ModalRenderer: React.FC<ModalRendererProps> = ({ modal, onCourseCreate }) => {
  if (!modal.visible) return null;

  switch (modal.type) {
    case "redirect":
      return (
        <RedirectingModal
          visible={modal.visible}
          status={modal.status}
          title={modal.title}
          message={modal.message}
        />
      );

    case "error":
      return (
        <ErrorModal
          message={modal.message}
          errorCode={modal.payload}
          onClose={modal.hide}
        />
      );

    case "course":
      return (
        <CourseModal
          isOpen={modal.visible}
          onClose={modal.hide}
          onCreate={onCourseCreate || (() => Promise.resolve())}
          modalTitle={modal.title}
          modalMessage={modal.message}
          modalStatus={modal.status}
        />
      );

      case "custom":
        const CustomComponent = CUSTOM_MODAL_COMPONENTS[modal.title];
        if (!CustomComponent) {
          console.error(`No custom modal component found for: ${modal.title}`);
          return null;
        }
        return (
          <CustomModal visible={modal.visible} title={modal.title} onClose={modal.hide}>
            <CustomComponent {...modal.payload} />
          </CustomModal>
        );
    default:
      return null;
  }
};

export default ModalRenderer;
