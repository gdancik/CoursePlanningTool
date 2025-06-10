import {useNavigate, useLocation} from "react-router-dom";
import {handleBack,handleNext} from "../../utils/ButtonLogic";
import AppLayout from "../../ApplicationLayout/Applayout";

const HIPs = () => {
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
            <h1>HIPs Page</h1>
        </div>
    );
};
export default HIPs;