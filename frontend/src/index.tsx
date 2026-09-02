import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

async function enableMocking() {
    if (
        process.env.NODE_ENV !== 'development' ||
        process.env.REACT_APP_USE_MSW !== 'true'
    ) {
        return;
    }

    const { worker } = await import('./test/mocks/browser');

    await worker.start({
        onUnhandledRequest: 'error',
    });
}

async function startApp() {
    await enableMocking();

    ReactDOM
        .createRoot(document.getElementById('root')!)
        .render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );

    reportWebVitals();
}

startApp();