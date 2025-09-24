import React from 'react';
import AppRoutes from './navigation/AppRoutes'
import {AuthProvider} from "./context/AuthContext";

const App: React.FC = () => {
    return (
        <>
            <main>
                <AuthProvider>
                    <AppRoutes/>
                </AuthProvider>
            </main>
        </>
    );
};

export default App;