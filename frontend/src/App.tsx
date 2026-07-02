import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './navigation/AppRoutes'
import {AuthProvider} from "./context/AuthContext";
import "./styles/syllabus.css"
import { AutoScrollToTop } from './components/ScrollToTop/ScrollToTop';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./query/queryClient";

const clientId= process.env.REACT_APP_CLIENT_ID ?? "";

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={clientId}>
                <BrowserRouter>
                    <AutoScrollToTop/>
                    <main>
                        <AuthProvider>
                            <AppRoutes/>
                        </AuthProvider>
                    </main>
                </BrowserRouter>
            </GoogleOAuthProvider>
    </QueryClientProvider>
    );
};

export default App;