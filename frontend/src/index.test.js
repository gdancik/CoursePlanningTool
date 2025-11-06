//CSS FONTS IMPORT
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestPageRunner from './TestPages/TestPageRunner';

// Test that TestPageRunner renders without crashing
test('TestPageRunner renders without crashing', () => {
    render(<TestPageRunner />);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals