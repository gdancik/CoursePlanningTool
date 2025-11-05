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
                    />

                    <div className="course-list">
                        <h2>My Courses</h2>
                        <p>Please Note: You can store up to 15 courses at a time. If you want to create more courses,
                            you will need to delete another course.</p>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="course-wrapper">
                                {courses.map((course) => (
                                    <CourseCard
                                        key={course.course_id}
                                        course={course}
                                        onEdit={() => handleEditCourse(course.course_id)}
                                        onDuplicate={() => handleDuplicateCourse(course.course_id)}
                                        onDelete={() => handleDeleteCourse(course.course_id)}
                                        onDownload={() => handlePreviewCourse(course.course_id, course.course_title_syllabus)}
                                    />
                                ))}
                            </div>
                        )}
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
