import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './navigation/AppRoutes'
import {AuthProvider} from "./context/AuthContext";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <main>
                <AuthProvider>
                    <AppRoutes/>
                </AuthProvider>
            </main>
        </BrowserRouter>
    );
};

export default App;