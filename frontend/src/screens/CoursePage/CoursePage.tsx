import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Course } from "../../services/courseTypes";
import StandardHeader from '../../components/Header/standardHeader';
import ReusableButton from '../../components/Button/ReusableButton';
import SafeIcon from '../../utils/course/ComponentWrapper';
import { FaPlus } from 'react-icons/fa';
import bgImage from '../../assets/images/bookstack-bg.png'
import CourseCard from './CourseCard';
import { Navigate, useNavigate } from 'react-router-dom';
import config from '../../configs/courseConfig.json';
import './CoursePage.css';
import {useModalFactory} from "../../utils/useModalFactory";
import ModalRenderer from "../../components/Modals/ModalRenderer";
import {useCoursesQuery} from "../../hooks/queries/useCoursesQuery";
import {useCourseActions} from "../../hooks/course/useCourseActions";

const CoursePage: React.FC = () => {
    const { user } = useAuth();
    const userEmail = user?.userEmail;

    const modal = useModalFactory();

    const {
        data: queriedCourses,
        isLoading,
        error,
    } = useCoursesQuery(userEmail);

    const courses = queriedCourses ?? [];

    const [sortBy, setSortBy] =
        useState<'course_number' | 'created' | 'last_edited'>('last_edited');

    const [sortAscending, setSortAscending] = useState(false);

    const maxCourses = config.max_courses;

    const {
        editCourse,
        previewCourse,
        deleteCourse,
        duplicateCourse,
        createCourse,
    } = useCourseActions({
        userEmail,
        modal,
    });

    const getCourseDisplayTitle = (course: Course): string => {
        return course.course_title_syllabus || "Untitled Course";
    };
    // Sorting function
    const getSafeTime = (value?: string): number => {
        if (!value) return 0;

        const time = new Date(value).getTime();

        return Number.isNaN(time) ? 0 : time;
    };

    const sortCourses = (courseList: Course[], sortKey: typeof sortBy): Course[] => {
        return [...courseList].sort((a, b) => {
            let comparison = 0;

            switch (sortKey) {
                case 'course_number': {
                    const aCode = `${a.subj_code_syllabus || ''} ${a.crse_number_syllabus || ''}`.trim();
                    const bCode = `${b.subj_code_syllabus || ''} ${b.crse_number_syllabus || ''}`.trim();

                    comparison = aCode.localeCompare(bCode);
                    break;
                }

                case 'created':
                    comparison = getSafeTime(b.created_at) - getSafeTime(a.created_at);
                    break;

                case 'last_edited':
                default:
                    comparison = getSafeTime(b.last_edited) - getSafeTime(a.last_edited);
                    break;
            }

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
                        onClick={() => modal.showCourseModal()}
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

                        {isLoading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Failed to load courses.</p>
                        ) : (
                            <div className="course-wrapper">
                                {sortedCourses.map((course) => (
                                    <CourseCard
                                        key={course.course_id}
                                        course={course}
                                        onEdit={() => editCourse(course.course_id, getCourseDisplayTitle(course))}
                                        onDuplicate={() => duplicateCourse(course.course_id, getCourseDisplayTitle(course))}
                                        onDelete={() => deleteCourse(course.course_id, getCourseDisplayTitle(course))}
                                        onDownload={() => previewCourse(course.course_id, getCourseDisplayTitle(course))}
                                        disableDuplicate={isAtMaxCapacity}
                                    />
                                ))}
                            </div>
                        )}
                     
                    </div>                                   
                </div>
            <ModalRenderer modal = {modal} onCourseCreate={createCourse}/>
        </div>
    );
};

export default CoursePage;
