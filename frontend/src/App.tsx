import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './navigation/AppRoutes'
import {AuthProvider} from "./context/AuthContext";
import "./styles/syllabus.css"
import { AutoScrollToTop } from './components/ScrollToTop/ScrollToTop';

const App: React.FC = () => {
    return (
        <BrowserRouter>
        <AutoScrollToTop/>
            <main>
                <AuthProvider>
                    <AppRoutes/>
                </AuthProvider>
            </main>
        </BrowserRouter>
    );
};

export default App;