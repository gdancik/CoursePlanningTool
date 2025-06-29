import React, {useEffect, useState} from 'react';
import StandardHeader from "../../components/Header/standardHeader";
import ReusableButton from "../../components/Button/ReusableButton";
import { FaPlus } from "react-icons/fa";
import SafeIcon from "../../utils/ComponentWrapper";
import {fetchCourses, Course} from "../../services/course/courseService";
import CourseModal from "../../components/CourseModal/NewCourseModal";
import CourseCard from "./CourseCard"
import bgImage from '../../assets/images/bookstack-bg.png'
import './CoursePage.css'

const CoursePage = () =>{
    const[isModalOpen, setModalOpen] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses()
            .then(setCourses)
            .catch((err) => console.error("Error loading courses:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleCreateCourse = (data: Record<string, string>) => {
        console.log("CourseData submitted form modal :", data);
        localStorage.setItem("newCourseData", JSON.stringify(data));


        //TODO: Set up backend or save local
    }
    return(
        <div>
            <StandardHeader/>
            <div className="course-page"
                 style={{
                     backgroundImage: `url(${bgImage})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                     backgroundAttachment: 'fixed',
                     minHeight: '100vh',
                 }}>
                <div className="overlay"/>
                <h1 className="course-tool-head">Course Planning Tool</h1>

                <ReusableButton
                    label="New Course"
                    icon={<SafeIcon Icon={FaPlus}/>}
                    variant="primary"
                    onClick={() => setModalOpen(true)}
                    className="course-page-button"
                />

                <div className="course-list">
                    <h1> My Courses</h1>
                    {loading ? (<p>Loading...</p>):
                        (
                            courses.map((course) => (
                                <CourseCard
                                key ={course.course_id}
                                course = {course}
                                onEdit={(id) => console.log("Edit", id)}
                                />
                            )))}
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