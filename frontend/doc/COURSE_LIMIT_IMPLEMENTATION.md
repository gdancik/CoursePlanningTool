# Course Limit and Sorting Implementation

This document explains the implementation of the course limit and sorting features for the My Courses page.

## Overview

The implementation includes:
1. **Course Limit Configuration**: A configurable maximum number of courses per user
2. **UI Restrictions**: Disabled buttons and warning messages when the limit is reached
3. **Sorting Functionality**: Sort courses by Course Number, Created date, or Last Edited date

## Files Modified

### 1. Configuration File
- **`frontend/src/config.json`**: Contains the `max_courses` setting (currently set to 3)

### 2. Main Course Page
- **`frontend/src/screens/CoursePage/CoursePage.tsx`**: 
  - Imports config.json
  - Adds sorting state and logic
  - Implements course limit checking
  - Disables "New Course" button when at capacity
  - Shows warning message when limit is reached

### 3. Component Updates
- **`frontend/src/components/Button/ReusableButton.tsx`**: Added `disabled` prop support
- **`frontend/src/screens/CoursePage/CourseButtonBar.tsx`**: Added `disableDuplicate` prop
- **`frontend/src/screens/CoursePage/CourseCard.tsx`**: Passes disabled state to button bar

### 4. Styling
- **`frontend/src/screens/CoursePage/CoursePage.css`**: Added styles for:
  - Course list header with sort dropdown
  - Maximum courses warning message
  - Sort dropdown styling
- **`frontend/src/components/Button/ReusableButton.css`**: Added disabled button styles

### 5. Service Layer
- **`frontend/src/services/course/courseService.ts`**: Updated Course interface to include `created_at` and `course_type` fields

## Features

### Course Limit
- **Configuration**: Set via `config.json` (`max_courses` property)
- **Current Limit**: 3 courses
- **Behavior When At Limit**:
  - "New Course" button becomes disabled
  - "Duplicate" buttons on all course cards become disabled  
  - Warning message appears: "You have reached the maximum number of courses. If you would like to add another course, please delete one of the current ones."

### Sorting
- **Sort Options**:
  - **Last Edited** (default): Shows most recently edited courses first
  - **Created**: Shows most recently created courses first
  - **Course Number**: Alphabetical sort by subject code + course number
- **UI**: Dropdown in the top-right of the course list header
- **Persistence**: Sort preference resets on page reload (could be enhanced to remember preference)

## Usage

### Changing the Course Limit
1. Edit `frontend/src/config.json`
2. Change the `max_courses` value
3. The UI will automatically respect the new limit

### Sort Behavior
- **Last Edited**: Courses with more recent "Last Edited" dates appear first
- **Created**: Courses with more recent creation dates appear first (falls back to course_id if created_at is not available)
- **Course Number**: Alphabetical sort combining subject code and course number (e.g., "CS 101", "MATH 200")

## Implementation Notes

### Backend Compatibility
- The implementation assumes the backend provides `Created` or `Created At` fields
- Falls back gracefully if these fields are not available
- Uses existing `Last Edited` field for sorting

### TypeScript Safety
- All new props are properly typed
- Course interface updated to include required fields
- Disabled state properly propagated through component hierarchy

### Accessibility
- Disabled buttons have proper styling and cursor states
- Sort dropdown has proper labels
- Warning message has distinctive styling for visibility

## Testing Recommendations

1. **Test Course Limit**:
   - Create courses up to the limit
   - Verify buttons become disabled
   - Verify warning message appears
   - Test that deleting a course re-enables buttons

2. **Test Sorting**:
   - Create courses with different titles, numbers, and edit dates
   - Verify each sort option works correctly
   - Test with edge cases (missing data)

3. **Test Responsive Design**:
   - Verify sort dropdown works on mobile devices
   - Check warning message display on small screens

## Future Enhancements

1. **Persistent Sort Preference**: Store user's sort preference in localStorage
2. **Configurable Limits**: Allow different limits per user type or subscription level
3. **Batch Operations**: Add ability to delete multiple courses at once when at limit
4. **Advanced Sorting**: Add secondary sort criteria or custom sort orders