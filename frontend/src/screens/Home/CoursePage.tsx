import React, {useEffect, useState} from 'react';
import StandardHeader from "../../components/Header/standardHeader";
import ReusableButton from "../../components/Button/ReusableButton";
import { FaPlus } from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import CourseModal from "../../components/CourseModal/NewCourseModal";
import {getCoursesFromSheet} from "../../services/course/courseService";
import './CoursePage.css'

const CoursePage = () =>{
    const[isModalOpen, setModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const sheetName = "annie";

    useEffect(() => {
        const fetchCourses = async() => {
            try {
                const data = await getCoursesFromSheet(sheetName);
                setCourses(data);
            }catch (err){
                console.error("Failed to load courses", err);
            }
        };
        fetchCourses();
    }, []);

    const handleCreateCourse = (data: Record<string, string>) => {
        console.log("CourseData submitted form modal :", data);
        localStorage.setItem("newCourseData", JSON.stringify(data));


        //TODO: Set up backend or save local
    }
    return(
        <div>
            <StandardHeader/>
            <div className="course-page">

                <h1 className="course-tool-head">Course Planning Tool</h1>

                <ReusableButton
                    label="New Course"
                    icon={<SafeIcon Icon={FaPlus}/>}
                    variant="primary"
                    onClick={() => setModalOpen(true)}
                    className="course-page-button"
                />

                <div className="course-list">
                    {courses.map((course: any, idx) => (
                        <div key={idx} className="course-item">
                            <h3>{course.course_title || "Untitled Course"}</h3>
                            <p>Instructor: {course.instructor || "N/A"}</p>
                        </div>
                    ))}
                </div>
        </div>
    <CourseModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateCourse}
    />

</div>
)
    ;
};
export default CoursePage;