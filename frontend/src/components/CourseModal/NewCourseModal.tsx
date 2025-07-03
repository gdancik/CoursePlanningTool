import React, { useState, useEffect } from 'react';
import courseFields from '../../courseFields.json';
import './CourseModal.css';
import { useNavigate } from 'react-router-dom';

interface CourseField {
    type: string;
    placeholder: string;
    required: boolean;
    options?: (string | number)[];
}

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Record<string, string>) => Promise<void>;
    modalTitle: string;
    modalMessage: string;
    modalStatus: 'loading' | 'success' | 'error';

}

const CourseModal: React.FC<CourseModalProps> = ({
                                                     isOpen,
                                                     onClose,
                                                     onCreate,
                                                     modalTitle,
                                                     modalMessage,
                                                     modalStatus,
                                                 }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Record<string, string>>({});

    const yearOptions = Array.from(
        { length: 2 },
        (_, i) => new Date().getFullYear() + i
    );

    useEffect(() => {
        courseFields.forEach((field: CourseField) => {
            if (field.placeholder === 'Year') {
                field.options = yearOptions;
            }
        });
    }, [yearOptions]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const next = { ...prev, [name]: value };
            console.log('️ [CourseModal] field change:', name, '→', value);
            console.log(' [CourseModal] formData now:', next);
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(' [CourseModal] Submitting formData:', formData);
        try {
            await onCreate(formData);
            console.log(
                ' [CourseModal] After onCreate, currentCourseId:',
                localStorage.getItem('currentCourseId')
            );
            onClose();
            navigate('/overview');
        } catch (err) {
            console.error(' Course creation failed:', err);
        }
    };

    if (!isOpen) return null;

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
                    {(modalTitle || modalMessage) && (
                        <div className={`modal-status ${modalStatus}`}>
                            <h3>{modalTitle}</h3>
                            <p>{modalMessage}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            {courseFields.map((field: CourseField, idx: number) => (
                                <div key={idx} className="form-group">
                                    {field.placeholder === 'Choose One' ? (
                                        <>
                                            <label className="elac-label">
                                                Is this an ELAC course? <br />
                                                <a
                                                    href="https://www.easternct.edu/academic-affairs/student-resources/hands-on-learning/elac.html"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Learn more about ELAC ↗
                                                </a>
                                            </label>
                                        </>
                                    ) : (
                                        <label>{field.placeholder}</label>
                                    )}

                                    {field.type === 'select' ? (
                                        <select
                                            name={field.placeholder}
                                            required={field.required}
                                            value={formData[field.placeholder] || ''}
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
                                            value={formData[field.placeholder] || ''}
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="create-button">
                            Create Course
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;
