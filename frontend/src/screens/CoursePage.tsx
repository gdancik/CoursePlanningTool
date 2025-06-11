import React, {useState} from 'react';
import StandardHeader from "../components/standardHeader";
import ReusableButton from "../components/ReusableButton";
import {FaPlus} from "react-icons/fa";
import SafeIcon from "../utils/ComponentWrapper";
import CourseModal from "../components/NewCourseModal";

const CoursePage = () =>{
    const[isModalOpen, setModalOpen] = useState(false);

    const handleCreateCourse = (data: Record<string, string>) => {
        console.log("CourseData submitted form modal :", data);
        //TODO: Set up backend or save local
    }
    return(
        <div>
            <StandardHeader/>
            <div>
                <h1>Course Planning Tool</h1>
                <ReusableButton
                label="New Course"
                icon={<SafeIcon Icon={FaPlus}/>}
                variant="primary"
                onClick={() =>setModalOpen(true)}
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