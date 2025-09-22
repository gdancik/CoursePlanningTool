import {useNavigate, useLocation} from "react-router-dom";
import {handleBack,handleNext} from "../../components/Button/ButtonLogic";
import AppLayout from "../../SyllabusLayout/SyllabusPageHeader";
import {useState} from "react";

const CourseSchedule = () => {
    //Page Navigation for Buttons
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState<Record<string, string>>({});
    const courseID = localStorage.getItem("currentCourseId")

    const handleBackClick = () => handleBack(navigate, location.pathname, formData, courseID || undefined);
    const handleNextClick = () => handleNext(navigate, location.pathname, formData, courseID || undefined);


    return (
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
            />
            <h1>Course Schedule Page</h1>
        </div>
    );
};
export default CourseSchedule;