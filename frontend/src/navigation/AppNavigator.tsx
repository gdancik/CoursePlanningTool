//This file contains all routes needed for the Course Planning Tool

import {Routes, Route} from 'react-router-dom';
import MainPage from '../screens/Home';

const AppNavigator = () => {
    return(
        <main>
            <Routes>
                <Route path = "/" element = {<MainPage/>} />
            </Routes>
        </main>
    );
};
export default AppNavigator;