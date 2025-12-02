/**
 * Mock Course Data for Testing
 * Use this to test the Overview page completeness checking
 */

// Complete Basic Information (all required fields filled)
export const MOCK_COMPLETE_BASIC_INFO = {
    "subj_code_syllabus": "CSC",
    "crse_number_syllabus": "201",
    "course_title_syllabus": "Introduction to Computer Science",
    "credits_syllabus": "3",
    "instructor_name_syllabus": "Dr. Jane Smith",
    "instructor_email_syllabus": "jane.smith@example.edu",
    "instructor_office_syllabus": "Science Building, Room 305",
    "instructor_office_hours_syllabus": "Monday/Wednesday 2-4pm",
    "term_syllabus": "Fall",
    "year_syllabus": "2025"
};

// Partial Basic Information (missing some fields)
export const MOCK_PARTIAL_BASIC_INFO = {
    "subj_code_syllabus": "CSC",
    "crse_number_syllabus": "201",
    "course_title_syllabus": "Introduction to Computer Science"
    // Missing other required fields
};

// Complete Course Description
export const MOCK_COMPLETE_COURSE_DESCRIPTION = {
    "course_description_syllabus": "This course introduces fundamental concepts of computer science including programming, algorithms, and data structures.",
    "course_vision": "Students will develop problem-solving skills and computational thinking."
};

/**
 * Helper function to load mock data into localStorage for testing
 * @param completeSections - Array of section names to mark as complete
 */
export function loadMockCourseData(completeSections: string[] = []) {
    const mockData: Record<string, string> = {};
    
    if (completeSections.includes('basic_information')) {
        Object.assign(mockData, MOCK_COMPLETE_BASIC_INFO);
    }
    
    if (completeSections.includes('course_description')) {
        Object.assign(mockData, MOCK_COMPLETE_COURSE_DESCRIPTION);
    }
    
    // Store in localStorage
    const courseData = {
        course_id: "test-course-123",
        savedData: mockData
    };
    
    localStorage.setItem("currentCourseData", JSON.stringify(courseData));
    localStorage.setItem("currentCourseId", "test-course-123");
    
    console.log('Mock course data loaded:', courseData);
    return courseData;
}

/**
 * Clear all mock data from localStorage
 */
export function clearMockCourseData() {
    localStorage.removeItem("currentCourseData");
    localStorage.removeItem("currentCourseId");
    console.log('Mock course data cleared');
}
