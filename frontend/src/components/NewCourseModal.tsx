//New Course Modal.tsx

import React, {useState, useEffect } from 'react';
import courseFields from '../courseFields.json'

//Type Definitions for the fields

interface CourseField {
    type: string;
    placeholder: string;
    required: boolean;
    options?: (string | number)[];
}

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Record<string, string>) => void;
}

const CourseModal: React.FC <CourseModalProps> = ({
    isOpen,
    onClose,
    onCreate
}) => {
    const [formData, setFormData] = useState<Record<string, string>>({});

    //Generate dynamic year options
    const yearOptions = Array.from(
        {length: 2},
        (_, i) => new Date().getFullYear() + i
    );

    useEffect(() => {
        courseFields.forEach((field: CourseField) => {
            if (field.placeholder === "Year") {
                field.options = yearOptions;
            }
        });
    }, [yearOptions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("JSON to Send:", formData);
        onCreate(formData);
        onClose();
    };
    if(!isOpen) return null;

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <button className = "close-btn" onClick={onClose}>
                    &times;
                </button>
                <h2>New courseDetails</h2>
                <p>Please enter the course details. You can update it at any time.</p>
                <div className="modal-left">
                    <form onSubmit={handleSubmit}>
                        {courseFields.map((field: CourseField, idx: number)=>(
                            <div key={idx} className="form-group">
                                <label>{field.placeholder}</label>
                                {field.type === "select" ? (
                                    <select
                                        name = {field.placeholder}
                                        required={field.required}
                                        value = {formData[field.placeholder] || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        {field.options?.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.placeholder}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        value={formData[field.placeholder] || ""}
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                        ))}
                        <button type ="submit" className="create-button">
                            Create Course
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default CourseModal;