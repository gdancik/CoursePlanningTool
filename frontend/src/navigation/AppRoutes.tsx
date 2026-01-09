//This file contains all routes needed for the Course Planning Tool

import {Routes, Route} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import ErrorModal from "../components/Modals/ErrorModal/ErrorModal";
import {setErrorModalHandler as setGlobalModal} from "../utils/errorHandler";

//Test Endpoint Imports
import MainPage from '../screens/testAPI/Home';
import LoginScreen from '../screens/Login/LoginScreen';
import Logout from '../screens/testAPI/Logout'
import Hello from '../screens/testAPI/Hello';

import {AutoPostRequest, AutoTestLogin} from "../components/API_tester";
import TestPage from "../screens/TestingPages/TestPage"
import TestPage2 from "../screens/TestingPages/TestPage2"
import TestPage3 from "../screens/TestPage3"
import TestSyllabusPage from "../screens/TestingPages/TestSyllabusPage";
import CourseSchedule from "../components/SyllabusComponents/Tables/courseSchedule";

//Application Endpoints
import Overview from "../screens/SyllabusView/Overview/Overview";
import Assessment from "../screens/SyllabusView/Assessments/Assessment";
import BasicInfo from "../screens/SyllabusView/BasicInformation/BasicInfo";
import HIPS from "../screens/SyllabusView/HIPS/HIPS";
import Description from "../screens/SyllabusView/Description/Description";
import CourseSchedulePage from "../screens/SyllabusView/CourseSchedule/CourseSchedule"
import LearningResources from "../screens/SyllabusView/LearningResources/LearningResources";
import Checklist from "../screens/SyllabusView/Checklist";
import CoursePage from "../screens/CoursePage/CoursePage";
import CoursePageTest from "../screens/CoursePage/CoursePageTest";
import NotFoundPage from "../screens/NotFoundPage";
import About from "../screens/About";
import Policies from "../screens/Policies";
import LearningOutcomes from "../screens/SyllabusView/Learning Outcomes/LearningOutcomes";

const AppRoutes = () => {
    const [modalMessage, setModalMessage] = useState<{ message: string; code?: number } | null>(null);

    useEffect(() => {
        setGlobalModal((error: { message: string; code?: number; }) => {
            setModalMessage(error)
        });
    }, []);
    return(
        <main>
            {modalMessage && (
                <ErrorModal
                    message={modalMessage.message}
                    errorCode={modalMessage.code}
                    onClose={() => setModalMessage(null)}
                />
            )}
            <Routes>
                {/*TEST API ENDPOINTS*/}                
                <Route path="/logout" element={<Logout />} />
                <Route path="/api/hello/" element={<Hello />} />
                <Route path = "/test-page" element={<TestPage/>}/>                
                <Route path = "/test-page2" element={<TestPage2/>}/>
                <Route path = "/test-page3" element={<TestPage3/>}/>
                <Route path ="/courseSchedule" 
                        element={<CourseSchedule
                            id = "course-schedule-table"
                            term = 'Spring' 
                            year = '2026' 
                            days = 'MWF'
                            data = {undefined}
                        />}
                />
                <Route path = "/test-syllabus" element={<TestSyllabusPage/>}/>

                <Route path="/auto_login"
                       element = {<AutoTestLogin
                           baseurl = "http://127.0.0.1:5000/api/test_login/"
                           user = "mike"
                           password = "password"
                       />}
                />

                <Route path="/test_post"
                       element = {<AutoPostRequest
                           url = 'http://127.0.0.1:5000/api/getSheet/'
                           body = {JSON.stringify( {sheet_name: 'annie'})}
                       />}
                />


                {/*Application EndPoints*/}
                <Route path="/" element={<LoginScreen />} />
                <Route path  ="course-page" element={<CoursePage/>}/>
                <Route path  ="course-test" element={<CoursePageTest/>}/>
                <Route path = "overview" element={<Overview/>}/>
                <Route path = "basic-info" element={<BasicInfo/>}/>
                <Route path = "course-description" element={<Description/>}/>
                <Route path = "learning-outcomes" element={<LearningOutcomes/>}/>
                <Route path = "hips" element={<HIPS/>}/>
                <Route path = "learning-resources" element={<LearningResources/>} />
                <Route path = "assessment" element={<Assessment/>} />
                <Route path = "course-schedule" element={<CourseSchedulePage/>}/>
                <Route path = "checklist" element={<Checklist/>}/>
                <Route path = "about" element={<About/>}/>
                <Route path = "policies" element={<Policies/>}/>
 
                <Route path="*" element={<NotFoundPage/>}/>

            </Routes>
        </main>
    );
};
export default AppRoutes;
