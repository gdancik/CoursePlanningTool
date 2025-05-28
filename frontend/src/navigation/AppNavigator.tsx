//This file contains all routes needed for the Course Planning Tool

import {Routes, Route} from 'react-router-dom';
import MainPage from '../screens/Home';
import Overview from "../screens/SyllabusView/Overview";

const AppNavigator = () => {
    return(
        <main>
            <Routes>
                <Route path = "/" element = {<Overview/>} />
            </Routes>
        </main>
    );
};
export default AppNavigator;