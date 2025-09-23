//This file contains all routes needed for the Course Planning Tool

import {Routes, Route} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import ErrorModal from "../components/ErrorModal/ErrorModal";
import {setErrorModalHandler as setGlobalModal} from "../utils/errorHandler";

//Test Endpoint Imports
import MainPage from '../screens/testAPI/Home';
import LoginScreen from '../screens/Login/LoginScreen';
import Logout from '../screens/testAPI/Logout'
import Hello from '../screens/testAPI/Hello';
import {AutoPostRequest, AutoTestLogin} from "../components/API_tester";
import TestPage from "../screens/TestPage"
import TestPage2 from "../screens/TestPage2"
import ScheduleTest from "../components/courseSchedule"
import GradeTable from "../components/Tables/gradeTable"
import JSONRenderTest from "../screens/JSONRenderTest"

//Application Endpoints
import Overview from "../screens/SyllabusView/Overview/Overview";
import Assessment from "../screens/SyllabusView/Assessment";
import BasicInfo from "../screens/SyllabusView/BasicInformation/BasicInfo";
import Description from "../screens/SyllabusView/Description/Description";
import LearningOutcomes from "../screens/SyllabusView/Learning Outcomes/LearningOutcomes";
import HIPs from "../screens/SyllabusView/HIPS/HIPs";
import CourseSchedule from "../screens/SyllabusView/CourseSchedule";
import LearningResources from "../screens/SyllabusView/LearningResources/LearningResources";
import Checklist from "../screens/SyllabusView/Checklist";
import CoursePage from "../screens/CoursePage/CoursePage";
import NotFoundPage from "../screens/NotFoundPage";

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
                <Route path ="/courseSchedule" element={<ScheduleTest/>}/>
                <Route path= "grade-table" element={<GradeTable/>} />
                <Route path = "/json-render" element={<JSONRenderTest/>} />

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
                <Route path = "overview" element={<Overview/>}/>
                <Route path = "basic-info" element={<BasicInfo/>}/>
                <Route path = "course-description" element={<Description/>}/>
                <Route path = "learning-outcomes" element={<LearningOutcomes/>}/>
                <Route path = "hips" element={<HIPs/>}/>
                <Route path = "learning-resources" element={<LearningResources/>} />
                <Route path = "assessment" element={<Assessment/>} />
                <Route path = "course-schedule" element={<CourseSchedule/>}/>
                <Route path = "checklist" element={<Checklist/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </main>
    );
};
export default AppRoutes;
