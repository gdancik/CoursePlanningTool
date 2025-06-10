import React from 'react';
import StandardHeader from "../components/standardHeader";
import ReusableButton from "../components/ReusableButton";
import {FaPlus} from "react-icons/fa";
import SafeIcon from "../utils/ComponentWrapper";

const CoursePage = () =>{
    return(
        <div>
            <StandardHeader/>
            <div>
                <h1>Course Planning Tool</h1>
                <ReusableButton
                label="New Course"
                icon={<SafeIcon Icon={FaPlus}/>}
                variant="primary"
                />
            </div>
        </div>
    );
};
export default CoursePage;