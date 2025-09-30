#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const testPage = process.argv[2] || 'components';

// Backup original index.js
const indexPath = path.join(__dirname, 'src', 'index.js');
const indexTestPath = path.join(__dirname, 'src', 'index.test.js');
const indexBackupPath = path.join(__dirname, 'src', 'index.js.backup');

console.log(`🧪 Setting up test environment for: ${testPage}`);

// Create backup (always ensure we have a backup)
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, indexBackupPath);
  console.log('📁 Created backup of current index.js');
} else if (!fs.existsSync(indexBackupPath)) {
  console.error('❌ No index.js found and no backup exists!');
  process.exit(1);
}

// Create test index.js with environment variable
const testIndexContent = `//CSS FONTS IMPORT
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TestPageRunner from './TestPageRunner';
import reportWebVitals from './reportWebVitals';

// Set the test page
process.env.REACT_APP_TEST_PAGE = '${testPage}';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <TestPageRunner />
    </React.StrictMode>
);

reportWebVitals();
`;

// Write test index.js
fs.writeFileSync(indexPath, testIndexContent);

console.log(`✅ Test environment ready! Starting development server...`);
console.log(`📄 Testing page: ${testPage}`);
console.log(`🚀 Server will start at http://localhost:3000`);

// Start the development server
const startProcess = spawn('npm', ['start'], { stdio: 'inherit', shell: true });

// Cleanup function
function cleanup() {
  console.log('\n🧹 Cleaning up test environment...');
  if (fs.existsSync(indexBackupPath)) {
    fs.copyFileSync(indexBackupPath, indexPath);
    fs.unlinkSync(indexBackupPath);
    console.log('✅ Original index.js restored - main app ready for npm start');
  } else {
    console.log('⚠️  No backup found to restore, creating default index.js...');
    const defaultIndexJs = `//CSS FONTS IMPORT
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();`;
    fs.writeFileSync(indexPath, defaultIndexJs);
    console.log('✅ Default index.js created - main app ready for npm start');
  }
  process.exit(0);
}

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

startProcess.on('close', (code) => {
  cleanup();
});