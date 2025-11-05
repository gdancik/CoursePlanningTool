import React from "react";
import RedirectingModal from "../RedirectingModal/RedirectingModal";
import ErrorModal from "../ErrorModal/ErrorModal";
import CourseModal from "../CourseModal/NewCourseModal";
import type { ModalFactory } from "../../utils/useModalFactory";

interface ModalRendererProps {
  modal: ModalFactory;
  onCourseCreate?: (data: Record<string, string>) => Promise<void>;
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

    default:
      return null;
  }
};

export default ModalRenderer;
