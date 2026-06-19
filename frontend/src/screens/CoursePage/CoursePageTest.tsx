import React, { useState } from 'react';
import StandardHeader from '../../components/Header/standardHeader';
import ReusableButton from '../../components/Button/ReusableButton';
import SafeIcon from '../../utils/course/ComponentWrapper';
import { FaPlus } from 'react-icons/fa';
import bgImage from '../../assets/images/bookstack-bg.png'
import CourseCard from './CourseCard';
import config from '../../configs/courseConfig.json';
import './CoursePage.css';

// Mock course data for testing
const MOCK_COURSES = [
    {
        course_id: '1',
        course_title_syllabus: 'Introduction to Computer Science',
        subj_code_syllabus: 'CSC',
        crse_number_syllabus: '101',
        instructor_name_syllabus: 'Dr. Smith',
        term_syllabus: 'Fall',
        year_syllabus: '2024',
        last_edited: '2024-10-07T10:30:00Z',
        created_at: '2024-09-15T09:00:00Z',
        course_type: 'Core'
    },
    {
        course_id: '2',
        course_title_syllabus: 'Data Structures and Algorithms',
        subj_code_syllabus: 'CSC',
        crse_number_syllabus: '201',
        instructor_name_syllabus: 'Dr. Johnson',
        term_syllabus: 'Spring',
        year_syllabus: '2024',
        last_edited: '2024-10-05T14:20:00Z',
        created_at: '2024-09-20T11:30:00Z',
        course_type: 'Core'
    },
    {
        course_id: '3',
        course_title_syllabus: 'Web Development',
        subj_code_syllabus: 'WEB',
        crse_number_syllabus: '301',
        instructor_name_syllabus: 'Dr. Wilson',
        term_syllabus: 'Fall',
        year_syllabus: '2024',
        last_edited: '2024-10-06T16:45:00Z',
        created_at: '2024-09-25T13:15:00Z',
        course_type: 'Elective'
    }
];

const CoursePageTest: React.FC = () => {
    const [courses, setCourses] = useState(MOCK_COURSES);
    const [sortBy, setSortBy] = useState<'course_number' | 'created' | 'last_edited'>('last_edited');
    const [sortAscending, setSortAscending] = useState(false); // false = descending (newest/Z-A first)
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Get max courses from config
    const maxCourses = config.max_courses;

    // Sorting function
    const sortCourses = (courseList: typeof courses, sortKey: typeof sortBy) => {
        return [...courseList].sort((a, b) => {
            let comparison = 0;
            
            switch (sortKey) {
                case 'course_number':
                    const aCode = `${a.subj_code_syllabus || ''} ${a.crse_number_syllabus || ''}`.trim();
                    const bCode = `${b.subj_code_syllabus || ''} ${b.crse_number_syllabus || ''}`.trim();
                    comparison = aCode.localeCompare(bCode);
                    break;
                case 'created':
                    const aCreated = a.created_at || a.course_id;
                    const bCreated = b.created_at || b.course_id;
                    comparison = new Date(bCreated).getTime() - new Date(aCreated).getTime();
                    break;
                case 'last_edited':
                default:
                    comparison = new Date(b.last_edited || '').getTime() - new Date(a.last_edited || '').getTime();
                    break;
            }
            
            // Reverse if ascending
            return sortAscending ? -comparison : comparison;
        });
    };

    // Get sorted courses
    const sortedCourses = sortCourses(courses, sortBy);
    const isAtMaxCapacity = courses.length >= maxCourses;

    // Mock handlers for testing
    const handleAddCourse = () => {
        if (isAtMaxCapacity) return;
        
        const newCourse = {
            course_id: `${courses.length + 1}`,
            course_title_syllabus: `New Course ${courses.length + 1}`,
            subj_code_syllabus: 'NEW',
            crse_number_syllabus: `${courses.length + 1}01`,
            instructor_name_syllabus: 'Test Instructor',
            term_syllabus: 'Fall',
            year_syllabus: '2024',
            last_edited: new Date().toISOString(),
            created_at: new Date().toISOString(),
            course_type: 'Test'
        };
        
        setCourses(prev => [...prev, newCourse]);
        setShowAddModal(false);
    };

    const handleDeleteCourse = (courseId: string) => {
        setCourses(prev => prev.filter(course => course.course_id !== courseId));
    };

    const handleDuplicateCourse = (courseId: string) => {
        if (isAtMaxCapacity) return;
        
        const originalCourse = courses.find(c => c.course_id === courseId);
        if (!originalCourse) return;
        
        const duplicatedCourse = {
            ...originalCourse,
            course_id: `${courses.length + 1}`,
            course_title_syllabus: `${originalCourse.course_title_syllabus} (Copy)`,
            last_edited: new Date().toISOString(),
            created_at: new Date().toISOString(),
        };
        
        setCourses(prev => [...prev, duplicatedCourse]);
    };

    return (
        <div>
            <StandardHeader/>
            <div className="course-page"
                 style={{
                     backgroundImage: `url(${bgImage})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                     backgroundAttachment: 'fixed',
                     minHeight: '100vh',
                 }}>

                <div className="overlay"/>
                <h1 className="course-tool-head">Course Planning Tool - TEST MODE</h1>
                
                {/* Test Controls */}
                <div style={{ 
                    background: 'rgba(255,255,255,0.9)', 
                    padding: '15px', 
                    margin: '20px', 
                    borderRadius: '8px',
                    border: '2px solid #007bff'
                }}>
                    <h3>🧪 Test Controls</h3>
                    <p><strong>Current Courses:</strong> {courses.length} / {maxCourses}</p>
                    <p><strong>At Max Capacity:</strong> {isAtMaxCapacity ? '✅ YES' : '❌ NO'}</p>
                    <p><strong>Add Button Status:</strong> {isAtMaxCapacity ? '🚫 DISABLED' : '✅ ENABLED'}</p>
                    <button 
                        onClick={() => setCourses([])} 
                        style={{ marginRight: '10px', padding: '5px 10px' }}
                    >
                        Clear All Courses
                    </button>
                    <button 
                        onClick={() => setCourses(MOCK_COURSES)} 
                        style={{ marginRight: '10px', padding: '5px 10px' }}
                    >
                        Reset to 3 Courses
                    </button>
                </div>

                <ReusableButton
                    label="New Course"
                    icon={<SafeIcon Icon={FaPlus}/>}
                    variant="primary"
                    onClick={handleAddCourse}
                    className="course-page-button"
                    disabled={isAtMaxCapacity}
                />

                <div className="course-list">
                    <div className="course-list-header">
                        <h2>My Courses</h2>
                        <div className="sort-dropdown">
                            <label htmlFor="sort-by">Sort by:</label>
                            <select 
                                id="sort-by"
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            >
                                <option value="last_edited">Last Edited</option>
                                <option value="created">Created</option>
                                <option value="course_number">Course Number</option>
                            </select>
                            <button 
                                className="sort-direction-btn"
                                onClick={() => setSortAscending(!sortAscending)}
                                title={sortAscending ? "Ascending (oldest/A-Z first)" : "Descending (newest/Z-A first)"}
                            >
                                {sortAscending ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                    
                    {isAtMaxCapacity && (
                        <div className="max-courses-message">
                            <p>You have reached the maximum number of courses. If you would like to add another course, please delete one of the current ones.</p>
                        </div>
                    )}
                    
                    <div className="course-wrapper">
                        {sortedCourses.map((course) => (
                            <CourseCard
                                key={course.course_id}
                                course={course}
                                onEdit={() => console.log('Edit:', course.course_id)}
                                onDuplicate={() => handleDuplicateCourse(course.course_id)}
                                onDelete={() => handleDeleteCourse(course.course_id)}
                                onDownload={() => console.log('Download:', course.course_id)}
                                disableDuplicate={isAtMaxCapacity}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePageTest;