import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createCourseHandler } from '../../utils/handlers/courseHandler';
import { getCourses, Course } from '../../services/course/courseService';
import StandardHeader from '../../components/Header/standardHeader';
import ReusableButton from '../../components/Button/ReusableButton';
import SafeIcon from '../../utils/ComponentWrapper';
import { FaPlus } from 'react-icons/fa';
import CourseModal from '../../components/CourseModal/NewCourseModal';
import CourseCard from './CourseCard';
import './CoursePage.css';

const CoursePage: React.FC = () => {
    // Always call hooks at the top-level
    const { user } = useAuth(); // user: string | null
    const [isModalOpen, setModalOpen] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalStatus, setModalStatus] = useState<'loading' | 'success' | 'error'>('loading');

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
    const modalControls = {
        setVisible: setModalOpen,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage,
    };

    // Create course handler using user ID
    const handleCreateCourse = createCourseHandler(
        modalControls,
        setCourses
    );

    // Guard: redirect if not logged in (after hooks)
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <StandardHeader />
            <div className="course-page">
                <div className="overlay" />
                <h1 className="course-tool-head">Course Planning Tool</h1>

                <ReusableButton
                    label="New Course"
                    icon={<SafeIcon Icon={FaPlus} />}
                    variant="primary"
                    onClick={() => setModalOpen(true)}
                    className="course-page-button"
                />

                <div className="course-list">
                    <h2>My Courses</h2>
                    <p>Please Note: You can store up to 15 courses at a time. If you want to create more courses, you will need to delete another course.</p>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="course-wrapper">
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.course_id}
                                    course={course}
                                    onEdit={(id) => console.log('Edit', id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CourseModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreateCourse}
                modalTitle={modalTitle}
                modalMessage={modalMessage}
                modalStatus={modalStatus}
            />
        </div>
    );
};

export default CoursePage;
