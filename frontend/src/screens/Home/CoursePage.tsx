import React, {useEffect, useState} from 'react';
import { createCourseHandler} from "../../utils/handlers/courseHandler";
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
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");


    const handleCreateCourse = (data: Record<string, string>) => {
        const handler = createCourseHandler(
            data,
            {
                setVisible: setModalOpen,
                setStatus: setModalStatus,
                setTitle: setModalTitle,
                setMessage: setModalMessage,
            },
            () => {}
        );
        handler();
    };

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
                modalTitle={modalTitle}
                modalMessage={modalMessage}
                modalStatus={modalStatus}
            />
</div>
)
    ;
};
export default CoursePage;