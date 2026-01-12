import React, { useEffect, useState } from 'react';
import RedirectingModal from "../../components/Modals/RedirectingModal/RedirectingModal";
import { useAuth } from '../../context/AuthContext';
import { createCourseHandler } from '../../utils/handlers/courseHandler';
import {
    createDeleteRowHandler,
    createEditHandler,
    createPreviewHandler,
    createDuplicateRowHandler
} from "../../utils/handlers/courseButtonHandler";
import { getCourses, Course } from '../../services/course/courseService';
import StandardHeader from '../../components/Header/standardHeader';
import ReusableButton from '../../components/Button/ReusableButton';
import SafeIcon from '../../utils/ComponentWrapper';
import { FaPlus } from 'react-icons/fa';
import bgImage from '../../assets/images/bookstack-bg.png'
import CourseModal from '../../components/CourseModal/NewCourseModal';
import CourseCard from './CourseCard';
import { Navigate, useNavigate } from 'react-router-dom';
import StandardFooter from '../../components/Footer/Footer';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import config from '../../config.json';
import './CoursePage.css';

const CoursePage: React.FC = () => {
    // Always call hooks at the top-level
    const { user } = useAuth(); // user: string | null
    const navigate = useNavigate();


    const [isCreateOpen, setCreateOpen] = useState(false);
    const [createTitle, setCreateTitle] = useState('');
    const [createMessage, setCreateMessage] = useState('');
    const [createStatus, setCreateStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const [isRedirectOpen, setRedirectOpen] = useState(false);
    const [redirectStatus, setRedirectStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const [redirectTitle, setRedirectTitle] = useState('');
    const [redirectMessage, setRedirectMessage] = useState('');


    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'course_number' | 'created' | 'last_edited'>('last_edited');
    const [sortAscending, setSortAscending] = useState(false); // false = descending (newest/Z-A first)
    
    // Get max courses from config
    const maxCourses = config.max_courses;


    // Load existing courses on mount
    useEffect(() => {
        (async () => {
            try {
                const result = await getCourses();
                setCourses(result ?? []);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Setup modal control callbacks
    const createModalControls = {
        setVisible: setCreateOpen,
        setStatus: setCreateStatus,
        setTitle: setCreateTitle,
        setMessage: setCreateMessage,
    };

    const redirectModalControls = {
        setVisible: setRedirectOpen,
        setStatus: setRedirectStatus,
        setTitle: setRedirectTitle,
        setMessage: setRedirectMessage,
    };

    // Create course handler using user ID
    const handleCreateCourse = createCourseHandler(createModalControls, setCourses);

    const handleEditCourse = createEditHandler(redirectModalControls, setCourses, navigate)

    const handlePreviewCourse = (courseId: string, courseTitle: string) => createPreviewHandler(redirectModalControls, courseId, courseTitle)();

    const handleDeleteCourse = createDeleteRowHandler(redirectModalControls, setCourses);

    const handleDuplicateCourse = createDuplicateRowHandler(redirectModalControls, setCourses);

    // Sorting function
    const sortCourses = (courseList: Course[], sortKey: typeof sortBy): Course[] => {
        return [...courseList].sort((a, b) => {
            let comparison = 0;
            
            switch (sortKey) {
                case 'course_number':
                    const aCode = `${a.subj_code_syllabus || ''} ${a.crse_number_syllabus || ''}`.trim();
                    const bCode = `${b.subj_code_syllabus || ''} ${b.crse_number_syllabus || ''}`.trim();
                    comparison = aCode.localeCompare(bCode);
                    break;
                case 'created':
                    // Assuming created_at exists, fallback to course_id as creation order
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


    // Guard: redirect if not logged in (after hooks)
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <StandardHeader/>
                <div className="course-page"
                     style = {{
                         backgroundImage: `url(${bgImage})`,
                         backgroundSize: 'cover',
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                         backgroundAttachment: 'fixed',
                         minHeight: '100vh',
                     }}>

                    <div className="overlay"/>
                    <h1 className="course-tool-head">Course Planning Tool</h1>

                    <ReusableButton
                        label="New Course"
                        icon={<SafeIcon Icon={FaPlus}/>}
                        variant="primary"
                        onClick={() => setCreateOpen(true)}
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

                        <div className='course-limit-info'>
                            <p> <b>Please Note:</b> You can store up to {maxCourses} courses a time. If you want to create more courses, 
                            you will need to delete another course. Editing an existing syllabus will overwrite the previously 
                            entered information. If you use the duplicate function, you will be able to preserve the original 
                            version and create a new version of the syllabus.</p> <p>&nbsp;</p>
                        </div>
                        
                        {isAtMaxCapacity && (
                            <div className="max-courses-message">
                                <p>You have reached the maximum number of courses. If you would like to add another course, please delete one of the current ones.</p>
                            </div>
                        )}
                        
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="course-wrapper">
                                {sortedCourses.map((course) => (
                                    <CourseCard
                                        key={course.course_id}
                                        course={course}
                                        onEdit={() => handleEditCourse(course.course_id)}
                                        onDuplicate={() => handleDuplicateCourse(course.course_id)}
                                        onDelete={() => handleDeleteCourse(course.course_id)}
                                        onDownload={() => handlePreviewCourse(course.course_id, course.course_title_syllabus)}
                                        disableDuplicate={isAtMaxCapacity}
                                    />
                                ))}
                            </div>
                        )}

                     <ScrollToTop/>
                    </div>               
                </div>

           
            <StandardFooter/>

            <CourseModal
                isOpen={isCreateOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreateCourse}
                modalTitle={createTitle}
                modalMessage={createMessage}
                modalStatus={createStatus}
            />

            {/* Redirecting modal for edit/delete/preview */}
            <RedirectingModal
                visible={isRedirectOpen}
                status={redirectStatus}
                title={redirectTitle}
                message={redirectMessage}
            />
        </div>
    );
};

export default CoursePage;
