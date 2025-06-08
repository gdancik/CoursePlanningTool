import {useNavigate, useLocation} from "react-router-dom";
import Applayout from "../../ApplicationLayout/Applayout";
import {handleBack,handleNext} from "../../utils/ButtonLogic";
import AppLayout from "../../ApplicationLayout/Applayout";

const LearningOutcomes = () => {
    //Page Navigation for Buttons
    const navigate = useNavigate();
    const location = useLocation();
    const handleBackClick = () => handleBack(navigate, location.pathname);
    const handleNextClick = () => handleNext(navigate, location.pathname);


    return (
        <div>
            <AppLayout
                onBack={handleBackClick}
                onNext={handleNextClick}
            />
            <h1>Learning Outcomes Page</h1>
        </div>
    );
};
export default LearningOutcomes ;