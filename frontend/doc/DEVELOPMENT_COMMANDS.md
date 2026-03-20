# Development Commands Guide

## 🚀 Available Commands

### `npm start`
**Purpose**: Runs the main **Course Planning Tool** application
- **What it does**: Starts the full application with login, course management, syllabus generation, etc.
- **URL**: http://localhost:3000
- **Use when**: You want to use or test the actual Course Planning Tool functionality

### `npm run myComponents` 
**Purpose**: Runs the **Component Showcase** for testing your custom components
- **What it does**: Displays your 4 custom components (Alert, Information, CheckboxGroup, SidebarLayout) with examples
- **URL**: http://localhost:3000 (temporarily replaces main app)
- **Use when**: You want to test, demonstrate, or develop your custom components

## 🔧 How It Works

### The Switching Mechanism
The `test-runner.js` script temporarily modifies the `src/index.js` file:

1. **Backup**: Creates a backup of the current `index.js` 
2. **Replace**: Temporarily changes `index.js` to render `TestPageRunner` instead of `App`
3. **Start**: Launches the development server
4. **Restore**: When you stop the server (Ctrl+C), it automatically restores the original `index.js`

### File Structure
```
src/
├── index.js           # Main entry point (switches between App and TestPageRunner)
├── index.js.backup    # Backup of original index.js
├── App.tsx            # Main Course Planning Tool application  
├── TestPageRunner.jsx # Component showcase page
└── components/
    └── SyllabusComponents/
        ├── Alert.tsx
        ├── Information.jsx  
        ├── CheckboxGroup.jsx
        └── SidebarLayout.jsx
```

## 🎯 Usage Examples

### Working on the Main Application
```bash
npm start
# ➜ Opens Course Planning Tool at localhost:3000
# ➜ Shows login screen, course management, etc.
```

### Testing Your Components  
```bash
npm run myComponents
# ➜ Opens Component Showcase at localhost:3000
# ➜ Shows your Alert, Information, CheckboxGroup, SidebarLayout components
# ➜ When you stop (Ctrl+C), automatically restores main app
```

### Running Tests
```bash
npm test
# ➜ Runs all unit tests including your component tests
```

## 🛡️ Safety Features

- **Automatic Backup**: Your original `index.js` is always backed up
- **Automatic Restore**: When you stop `myComponents`, the original app is restored
- **No Data Loss**: The switching is temporary and reversible

## 🔄 Manual Restoration (if needed)

If something goes wrong and the app doesn't restore properly:

```bash
# Check if backup exists
ls src/index.js.backup

# Manually restore if needed
cp src/index.js.backup src/index.js
```

## 📝 Notes

- Only one command can run at a time (both use port 3000)
- The `myComponents` command is designed for development and testing
- The main app (`npm start`) is what users would actually use
- Both commands support hot reloading for development