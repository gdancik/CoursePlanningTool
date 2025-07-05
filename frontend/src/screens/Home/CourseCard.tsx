import React from "react";
import { Course } from "../../services/course/courseService";
import './CourseCard.css';
import { FaFileAlt } from 'react-icons/fa';
import SafeIcon from "../../utils/ComponentWrapper";
import CourseButtonBar from "./CourseButtonBar";

interface CourseCardProps {
    course: Course;
    onEdit?:() => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
                                                   course,
                                                   onEdit,
                                                   onDuplicate,
                                                   onDelete,
                                                   onDownload}) => {
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
                <CourseButtonBar
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    />
            </div>
        </div>
    );
};

export default CourseCard;
