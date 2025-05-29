//This file contains all routes needed for the Course Planning Tool

import {Routes, Route} from 'react-router-dom';
import MainPage from '../screens/Home';
import Overview from "../screens/SyllabusView/Overview";
import Assessment from "../screens/SyllabusView/Assessment";
import BasicInfo from "../screens/SyllabusView/BasicInfo";
import Description from "../screens/SyllabusView/Description";
import LearningOutcomes from "../screens/SyllabusView/LearningOutcomes";
import HIPs from "../screens/SyllabusView/HIPs";
import CourseSchedule from "../screens/SyllabusView/CourseSchedule";
import LearningResources from "../screens/SyllabusView/LearningResources";
import Checklist from "../screens/SyllabusView/Checklist";

const AppRoutes = () => {
    return(
        <main>
            <Routes>
                <Route path = "/" element = {<MainPage/>} />
                <Route path = "overview" element={<Overview/>}/>
                <Route path = "basic-info" element={<BasicInfo/>}/>
                <Route path = "coure-description" element={<Description/>}/>
                <Route path = "learning-outcomes" element={<LearningOutcomes/>}/>
                <Route path = "hips" element={<HIPs/>}/>
                <Route path = "learning-resources" element={<LearningResources/>} />
                <Route path ="assessment" element={<Assessment/>} />
                <Route path = "course-schedule" element={<CourseSchedule/>}/>
                <Route path = "checklist" element={<Checklist/>}/>
            </Routes>
        </main>
    );
};
export default AppRoutes;