import React from "react";
import { Course } from "../../services/course/courseService";
import './CourseCard.css';
import { FaFileAlt } from 'react-icons/fa';
import SafeIcon from "../../utils/ComponentWrapper";

interface CourseCardProps {
    course: Course;
    onEdit?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
    return (
        <div className="course-card">
            <div className="course-left">
                <SafeIcon Icon={FaFileAlt} className="course-icon" />

                <div className="course-details">
                    {(course.subj_code_syllabus || course.crse_number_syllabus) && (
                        <h2 className="course-code">
                            {course.subj_code_syllabus}
                            {course.subj_code_syllabus && course.crse_number_syllabus && " "}
                            {course.crse_number_syllabus}
                        </h2>
                    )}
                    <h3 className="course-title">{course.course_title_syllabus || 'Untitled Course'}</h3>
                    <p className="course-term">
                        {course.term_syllabus}
                        {course.year_syllabus && ` ${course.year_syllabus}`}
                    </p>
                    <p className="course-type">{course.course_type || 'General Education'}</p>
                    <div className="course-meta">
                        <span>Created: {course.created_at}</span>
                        <span>Last Edited: {course.last_edited}</span>
                    </div>
                </div>
            </div>
            <div className="course-right">
                <div className="button-group"></div>
                <button className="btn btn-edit" onClick={() => onEdit?.(course.course_id)}>Edit</button>
            </div>
        </div>
    );
};

export default CourseCard;
