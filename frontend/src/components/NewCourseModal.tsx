//New Course Modal.tsx

import React, {useState, useEffect } from 'react';
import courseFields from '../courseFields.json'
import './CourseModal.css'
import {useNavigate} from "react-router-dom";

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

    const navigate = useNavigate()

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

        const courseId = `${formData["Course Code"]}-${formData["Course number"]}-${formData["Year"]}`;
        const existingCourses = JSON.parse(localStorage.getItem("allCourses") || "{}");

        if (existingCourses[courseId]) {
            alert("Course already exists. Redirecting to existing course.");
            localStorage.setItem("selectedCourse", courseId);
            navigate("/overview");
            return;
        }

        // Save new course
        existingCourses[courseId] = formData;
        localStorage.setItem("allCourses", JSON.stringify(existingCourses));
        localStorage.setItem("selectedCourse", courseId);

        console.log("New course created:", formData);
        onCreate(formData);
        onClose();
        navigate("/overview");
    };

    if(!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal-left">
                    <h2>NEW COURSE DETAILS</h2>
                    <p>Please enter the course details. You can update it at any time.</p>
                </div>
                <div className="modal-right">
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            {courseFields.map((field: CourseField, idx: number) => (
                                <div key={idx} className="form-group">
                                    {field.placeholder === "Choose One" ? (
                                        <>
                                            <label className="elac-label">
                                                Is this an ELAC course? <br />
                                                <a href="https://www.easternct.edu/academic-affairs/student-resources/hands-on-learning/elac.html" target="_blank" rel="noopener noreferrer">
                                                    Learn more about ELAC ↗
                                                </a>
                                            </label>
                                        </>
                                    ) : (
                                        <label>{field.placeholder}</label>
                                    )}

                                    {field.type === "select" ? (
                                        <select
                                            name={field.placeholder}
                                            required={field.required}
                                            value={formData[field.placeholder] || ""}
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
                        </div>
                        <button type="submit" className="create-button">Create Course</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default CourseModal;