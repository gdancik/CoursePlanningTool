import React from 'react';
import CoursePageTest from './screens/CoursePage/CoursePageTest';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

const TestApp: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <header style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    padding: '10px', 
                    textAlign: 'center' 
                }}>
                    <h2>🧪 Course Features Test Mode</h2>
                    <p>Testing Course Limit (Max: 3) and Sorting Features</p>
                </header>
                <CoursePageTest />
            </div>
        </BrowserRouter>
    );
};

export default TestApp;