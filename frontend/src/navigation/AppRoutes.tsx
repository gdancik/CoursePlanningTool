//This file contains all routes needed for the Course Planning Tool

import {Routes, Route} from 'react-router-dom';

//Test Endpoint Imports
import MainPage from '../screens/testAPI/Home';
import LoginScreen from '../screens/LoginScreen';
import Logout from '../screens/testAPI/Logout'
import Hello from '../screens/testAPI/Hello';

//Application Endpoints
import Overview from "../screens/SyllabusView/Overview/Overview";
import Assessment from "../screens/SyllabusView/Assessment";
import BasicInfo from "../screens/SyllabusView/BasicInformation/BasicInfo";
import Description from "../screens/SyllabusView/Description";
import LearningOutcomes from "../screens/SyllabusView/LearningOutcomes";
import HIPs from "../screens/SyllabusView/HIPs";
import CourseSchedule from "../screens/SyllabusView/CourseSchedule";
import LearningResources from "../screens/SyllabusView/LearningResources";
import Checklist from "../screens/SyllabusView/Checklist";
import {AutoPostRequest, AutoTestLogin} from '../components/API_tester';

const AppRoutes = () => {
    return(
        <main>
            <Routes>
                {/*TEST API ENDPOINTS*/}
                <Route path = "/" element = {<MainPage/>} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/api/hello/" element={<Hello />} />            
                                
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
                <Route path = "overview" element={<Overview/>}/>
                <Route path = "basic-info" element={<BasicInfo/>}/>
                <Route path = "course-description" element={<Description/>}/>
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