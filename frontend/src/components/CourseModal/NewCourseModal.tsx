// src/components/CourseModal/NewCourseModal.tsx
import React, { useState, useEffect } from "react";
import "./CourseModal.css";
import { useNavigate } from "react-router-dom";
import modalConfig from "../CourseModal/courseModalFields.json";

export type ModalStatus = "loading" | "success" | "error";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Record<string, string>) => Promise<void>;
  modalTitle: string;
  modalMessage: string;
  modalStatus: ModalStatus;
}

const NewCourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  modalTitle,
  modalMessage,
  modalStatus,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(modalConfig.fields);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setFields((prev) =>
      prev.map((f) =>
        f.id === "year_syllabus"
          ? { ...f, options: [currentYear.toString(), nextYear.toString()] }
          : f
      )
    );
  }, []);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate(formData);
      onClose();
      navigate("/overview");
    } catch (err) {
      console.error("Course creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal-left">
          <h2>{modalTitle || modalConfig.title}</h2>
          <p>{modalMessage || modalConfig.message}</p>
        </div>

        <div className="modal-right">
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {fields.map((field, idx) => (
                <div key={idx} className="form-group">
                  <label>{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.id}
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.id}
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="create-button" disabled={isSubmitting}>
              {isSubmitting ? <div className="button-spinner" /> : "Create Course"}
            </button>

            {modalStatus === "error" && (
              <p className="error-text">An error occurred. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCourseModal;
