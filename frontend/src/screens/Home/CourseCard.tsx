import React from "react";
import 'CourseCard.css'

interface CourseCardProps{
    course: {
        course_id: string;
        course_title: string;
        instructor: string;
        term: string;
        last_edited: string;
    };
    onEdit?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
    course,
    onEdit,
}) => {
    return(
        <div>
            <h2>{course.course_title}</h2>
            <p><strong>Instructor:</strong> {course.instructor}</p>
            <p><strong>Term:</strong>{course.term}</p>
            <p><strong>Last Edited:</strong>{new Date(course.last_edited).toLocaleDateString()}</p>
            <button onClick={() => onEdit?.(course.course_id)}>Edit</button>
        </div>

    );
};

export default CourseCard;