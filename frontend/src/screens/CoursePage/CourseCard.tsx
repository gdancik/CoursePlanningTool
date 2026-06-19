import React from "react";
import { Course } from "../../services/course/courseService";
import './CourseCard.css';
import { FaFileAlt } from 'react-icons/fa';
import SafeIcon from "../../utils/course/ComponentWrapper";
import CourseButtonBar from "./CourseButtonBar";
interface CourseCardProps {
    course: Course;
    onEdit?:(id: string) => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
    disableDuplicate?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
                                                   course,
                                                   onEdit,
                                                   onDuplicate,
                                                   onDelete,
                                                   onDownload,
                                                   disableDuplicate = false}) => {

    const handleEdit = () => {
        if (onEdit) onEdit(course.course_id);
    };

    const handleDownload = () => {
        if (onDownload) onDownload();
    };

    const handleDelete = () => {
        if (onDelete) onDelete();

    }

    const convertDate = (s:string | undefined): string | undefined => {
        if (!s) return s;
       
        let createdDate = new Date(s);
        s = createdDate.toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    
        return s;
    }
    

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
                        <p>Created: {convertDate(course.created_at)}</p>
                        <p>Last Edited: {convertDate(course.last_edited)}</p>
                    </div>
                </div>
            </div>
            <div className="course-right">
                <div className="button-group"></div>
                <CourseButtonBar
                    onEdit={handleEdit}
                    onDuplicate={onDuplicate}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    disableDuplicate={disableDuplicate}
                    />
            </div>
        </div>
    );
};

export default CourseCard;
