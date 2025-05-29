import React from 'react';
import {NavLink} from  'react-router-dom';
import './SyllabusNav.css';

const tabs = [
    {label: "Overview", path:"/overview"} ,
    {label: "Basic Information", path:"/basic-info"},
    {label: "Description", path:"/course-description"},
    {label: "Learning Outcomes", path: "/learning-outcomes"},
    {label: "HIPs", path: "/hips"},
    {label: "Learning Resources", path:"/learning-resources"},
    {label: "Assessment", path:"/assessment"},
    {label: "Course Schedule", path:"/course-schedule"},
    {label: "Checklist", path: "/checklist"},
];

const SyllabusNav = () => {
    return (
        <nav className="syllabus-nav">
            {tabs.map((tab) => (
                <NavLink
                    key= {tab.path}
                    to={tab.path}
                    className={({isActive})=>
                        isActive ? 'nav-tab active' : 'nav-tab'
                }
                >
                    {tab.label}
                </NavLink>
            ))}
        </nav>
   );
};
export default SyllabusNav;
