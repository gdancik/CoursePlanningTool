//CSS FONTS IMPORT
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TestApp from './TestApp';
import reportWebVitals from './reportWebVitals';

// Check URL parameters or environment to determine test mode
const urlParams = new URLSearchParams(window.location.search);
const isTestMode = urlParams.get('test') === 'true' || window.location.pathname === '/test';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {isTestMode ? <TestApp /> : <App />}
    </React.StrictMode>
);

reportWebVitals();
