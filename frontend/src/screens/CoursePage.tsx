import React, {useState} from 'react';
import StandardHeader from "../components/standardHeader";
import ReusableButton from "../components/ReusableButton";
import {FaPlus} from "react-icons/fa";
import SafeIcon from "../utils/ComponentWrapper";
import CourseModal from "../components/NewCourseModal";
import './CoursePage.css'

const CoursePage = () =>{
    const[isModalOpen, setModalOpen] = useState(false);

    const handleCreateCourse = (data: Record<string, string>) => {
        console.log("CourseData submitted form modal :", data);
        localStorage.setItem("newCourseData", JSON.stringify(data));
        //TODO: Set up backend or save local
    }
    return(
        <div>
            <StandardHeader/>
            <div className="course-page">

                <h1 className ="course-tool-head">Course Planning Tool</h1>

                <ReusableButton
                    label="New Course"
                    icon={<SafeIcon Icon={FaPlus}/>}
                    variant="primary"
                    onClick={() =>setModalOpen(true)}
                    className ="course-page-button"
                />
            </div>
            <CourseModal
                isOpen={isModalOpen}
                onClose={()=> setModalOpen(false)}
                onCreate={handleCreateCourse}
            />

        </div>
    );
};
export default CoursePage;